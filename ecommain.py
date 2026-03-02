#!/usr/bin/env python3
"""
PostgreSQL Database Copy Script
Copies all tables and data from source to target.

Preferred method: pg_dump | psql (perfect 1:1 copy)
Fallback method:  Python with proper type handling

Usage:
    python copy_postgres.py --target "postgresql://user:pass@host/dbname"
    python copy_postgres.py --target "..." --python-only   # skip pg_dump

Or via env var:
    TARGET_DB_URL="postgresql://..." python copy_postgres.py
"""

import argparse
import os
import sys
import subprocess
import tempfile

# ── Pre-filled source URL ────────────────────────────────────────────────────
SOURCE_DB_URL = "postgresql://neondb_owner:XiTslbJ21yuG@ep-late-cloud-a1dp1i6r-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


# ────────────────────────────────────────────────────────────────────────────
# METHOD 1: pg_dump → psql  (best — perfectly preserves types, FK, indexes)
# ────────────────────────────────────────────────────────────────────────────

def check_pg_tools():
    for tool in ["pg_dump", "psql"]:
        if subprocess.run(["which", tool], capture_output=True).returncode != 0:
            return False
    return True


def copy_via_pg_dump(source_url, target_url):
    print("🚀 Using pg_dump → psql pipeline (most reliable)\n")

    with tempfile.NamedTemporaryFile(suffix=".sql", delete=False) as f:
        dump_file = f.name

    try:
        print("📤 Dumping source database...")
        result = subprocess.run(
            ["pg_dump", "--no-owner", "--no-acl", "--schema=public", source_url, "-f", dump_file],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            if "version mismatch" in result.stderr:
                print(f"❌ pg_dump version mismatch (your pg_dump is older than the server).")
                print("   Fix: brew install postgresql@16   then use the new pg_dump.")
                print("   Falling back to Python method...\n")
            else:
                print(f"❌ pg_dump failed:\n{result.stderr}")
            return False

        print(f"   Dump size: {os.path.getsize(dump_file) / 1024:.1f} KB")
        print("📥 Restoring to target database...")

        result = subprocess.run(
            ["psql", target_url, "-f", dump_file],
            capture_output=True, text=True
        )
        if result.stderr:
            print(f"   Notes:\n{result.stderr[:500]}")
        print("✅ Restore complete!")
        return True

    finally:
        if os.path.exists(dump_file):
            os.unlink(dump_file)


# ────────────────────────────────────────────────────────────────────────────
# METHOD 2: Pure Python fallback
# ────────────────────────────────────────────────────────────────────────────

def install_psycopg2():
    try:
        import psycopg2
    except ImportError:
        print("📦 Installing psycopg2-binary...")
        subprocess.run([sys.executable, "-m", "pip", "install", "psycopg2-binary", "-q"], check=True)


def copy_via_python(source_url, target_url):
    import psycopg2
    import psycopg2.extras

    print("🐍 Using Python-based copy\n")

    src = psycopg2.connect(source_url)
    tgt = psycopg2.connect(target_url)
    src.autocommit = False  # named cursors need a transaction open

    def get_ordered_tables(conn):
        """Return tables sorted by FK dependency (parents first)."""
        from collections import defaultdict, deque
        with conn.cursor() as cur:
            cur.execute("""
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public' ORDER BY tablename;
            """)
            all_tables = [r[0] for r in cur.fetchall()]

            cur.execute("""
                SELECT tc.table_name, ccu.table_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.referential_constraints rc
                    ON tc.constraint_name = rc.constraint_name
                JOIN information_schema.constraint_column_usage ccu
                    ON rc.unique_constraint_name = ccu.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                  AND tc.table_schema = 'public';
            """)
            deps = cur.fetchall()

        table_set = set(all_tables)
        graph = defaultdict(set)
        in_degree = {t: 0 for t in all_tables}
        for child, parent in deps:
            if child != parent and child in table_set and parent in table_set:
                graph[parent].add(child)
                in_degree[child] += 1

        queue = deque([t for t in all_tables if in_degree[t] == 0])
        ordered = []
        while queue:
            node = queue.popleft()
            ordered.append(node)
            for child in sorted(graph[node]):
                in_degree[child] -= 1
                if in_degree[child] == 0:
                    queue.append(child)
        for t in all_tables:
            if t not in ordered:
                ordered.append(t)
        return ordered

    def get_create_ddl(conn, table):
        """Build CREATE TABLE DDL using pg catalog for accurate types."""
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    a.attname AS col_name,
                    pg_catalog.format_type(a.atttypid, a.atttypmod) AS col_type,
                    a.attnotnull,
                    pg_get_expr(d.adbin, d.adrelid) AS col_default
                FROM pg_attribute a
                JOIN pg_class c ON c.oid = a.attrelid
                JOIN pg_namespace n ON n.oid = c.relnamespace
                LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
                WHERE n.nspname = 'public'
                  AND c.relname = %s
                  AND a.attnum > 0
                  AND NOT a.attisdropped
                ORDER BY a.attnum;
            """, (table,))
            cols = cur.fetchall()

            # Primary key
            cur.execute("""
                SELECT a.attname
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                JOIN pg_class c ON c.oid = i.indrelid
                JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE i.indisprimary
                  AND n.nspname = 'public'
                  AND c.relname = %s
                ORDER BY a.attnum;
            """, (table,))
            pk_cols = [r[0] for r in cur.fetchall()]

        col_defs = []
        for col_name, col_type, not_null, default in cols:
            line = f'    "{col_name}" {col_type}'
            if not_null:
                line += " NOT NULL"
            if default:
                line += f" DEFAULT {default}"
            col_defs.append(line)

        if pk_cols:
            pk_str = ", ".join(f'"{c}"' for c in pk_cols)
            col_defs.append(f"    PRIMARY KEY ({pk_str})")

        return f'CREATE TABLE IF NOT EXISTS "{table}" (\n' + ",\n".join(col_defs) + "\n);"

    print("📋 Analysing table dependencies...")
    tables = get_ordered_tables(src)
    print(f"   Found {len(tables)} tables: {', '.join(tables)}\n")

    # Drop existing tables in target (reverse order to respect FKs)
    print("🗑️  Dropping existing tables in target...")
    with tgt.cursor() as cur:
        for table in reversed(tables):
            cur.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE;')
    tgt.commit()

    # Create tables
    print("\n🏗️  Creating tables...")
    for table in tables:
        ddl = get_create_ddl(src, table)
        with tgt.cursor() as cur:
            try:
                cur.execute(ddl)
                tgt.commit()
                print(f"  ✅ {table}")
            except Exception as e:
                tgt.rollback()
                print(f"  ❌ {table}: {e}")
                print(f"     DDL was:\n{ddl}\n")

    # Copy data
    print("\n📦 Copying data...")
    total = 0
    for table in tables:
        try:
            with src.cursor() as cur:
                cur.execute(f"""
                    SELECT column_name FROM information_schema.columns
                    WHERE table_schema='public' AND table_name=%s
                    ORDER BY ordinal_position;
                """, (table,))
                col_names = [r[0] for r in cur.fetchall()]

            col_str = ", ".join(f'"{c}"' for c in col_names)
            placeholders = ", ".join(["%s"] * len(col_names))
            insert_sql = f'INSERT INTO "{table}" ({col_str}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'

            with src.cursor(name=f"fetch_{table}") as src_cur:
                src_cur.execute(f'SELECT {col_str} FROM "{table}"')
                count = 0
                while True:
                    rows = src_cur.fetchmany(500)
                    if not rows:
                        break
                    with tgt.cursor() as tgt_cur:
                        psycopg2.extras.execute_batch(tgt_cur, insert_sql, rows, page_size=500)
                    tgt.commit()
                    count += len(rows)

            print(f"  ✅ {table}: {count} rows")
            total += count

        except Exception as e:
            tgt.rollback()
            print(f"  ❌ {table}: {e}")

    src.close()
    tgt.close()
    print(f"\n🎉 Done! Copied {total} rows across {len(tables)} tables.")


# ────────────────────────────────────────────────────────────────────────────
# Main
# ────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Copy all tables and data between PostgreSQL DBs.")
    parser.add_argument("--source", default=SOURCE_DB_URL, help="Source database URL")
    parser.add_argument("--target", default=os.environ.get("TARGET_DB_URL"), help="Target database URL")
    parser.add_argument("--python-only", action="store_true", help="Force Python method (skip pg_dump)")
    args = parser.parse_args()

    source_url = args.source
    target_url = args.target

    if not target_url:
        print("❌ No target DB URL provided.")
        print("   Use: --target 'postgresql://user:pass@host/dbname'")
        print("   Or:  export TARGET_DB_URL='postgresql://...'")
        sys.exit(1)

    print(f"Source: {source_url.split('@')[-1].split('?')[0]}")
    print(f"Target: {target_url.split('@')[-1].split('?')[0]}\n")

    if not args.python_only and check_pg_tools():
        if copy_via_pg_dump(source_url, target_url):
            print("\n🎉 All done!")
            return
        print("\n⚠️  pg_dump failed, falling back to Python method...\n")

    install_psycopg2()
    copy_via_python(source_url, target_url)


if __name__ == "__main__":
    main()