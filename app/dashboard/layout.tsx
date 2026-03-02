import { ReactNode } from "react";
import { DashboardNavigation } from "../../components/dashboard/DasboardNavigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CircleUser, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { unstable_noStore as noStore } from "next/cache";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r border-neutral-200 bg-white">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-neutral-200">
          <h1 className="text-lg font-bold uppercase tracking-[0.15em]">PAMARA</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4 overflow-y-auto">
          <DashboardNavigation />
        </nav>

        {/* User */}
        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-medium uppercase">
              {user.given_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.given_name || "Admin"}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 bg-white shrink-0">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="shrink-0 md:hidden"
                variant="outline"
                size="icon"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="h-16 flex items-center px-5 border-b border-neutral-200">
                <h1 className="text-lg font-bold uppercase tracking-[0.15em]">PAMARA</h1>
              </div>
              <nav className="flex flex-col gap-0.5 px-3 py-4">
                <DashboardNavigation />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden md:block">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-[0.1em]">
              Admin Panel
            </h2>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <CircleUser className="w-5 h-5" strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutLink>Logout</LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
