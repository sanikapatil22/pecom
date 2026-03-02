"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  FileText,
  Tag,
  Store,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Banner",
    href: "/dashboard/banner",
    icon: ImageIcon,
  },
  {
    name: "Home Content",
    href: "/dashboard/home",
    icon: FileText,
  },
  {
    name: "Coupons",
    href: "/dashboard/coupons",
    icon: Tag,
  },
];

export function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <>
      {/* Back to store link */}
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors mb-2"
      >
        <Store className="w-4 h-4" />
        Back to Store
      </Link>

      <div className="w-full h-px bg-neutral-200 mb-2" />

      {links.map((link) => {
        const isActive =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
            )}
          >
            <Icon className="w-4 h-4" />
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
