"use server";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserDropdown } from "./UserDropdown";
import CartSheet, { Cart } from "./BagSheet";
import {
  User,
  Search as SearchIcon,
} from "lucide-react";
import { redis } from "@/app/lib/redis";
import MobileNavbar from "../MobileNavBar";
import NavMenu from "./NavMenu";

export async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const wishlist: Cart | null = await redis.get(`wishlist-${user?.id}`);
  const totalItems = wishlist?.items.length ?? 0;

  return (
    <div className="flex flex-col w-full fixed top-0 z-50">
      {/* Announcement Bar */}
      <div className="w-full bg-black text-white">
        <div className="flex justify-center items-center h-8">
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
            {!user
              ? "Sign up for faster checkout & easy returns"
              : "Free shipping on all orders over ₹999"}
          </span>
        </div>
      </div>

      {/* Brand Row — logo center, icons right */}
      <div className="w-full bg-white border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="h-16 grid grid-cols-3 items-center">
            {/* Left — mobile hamburger / desktop empty or info */}
            <div className="flex items-center">
              <div className="md:hidden">
                <MobileNavbar />
              </div>
            </div>

            {/* Center — Brand Name */}
            <div className="flex justify-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-3xl md:text-4xl font-bold tracking-[0.35em] uppercase">
                  PAMARA
                </h1>
              </Link>
            </div>

            {/* Right — Icons */}
            <div className="flex items-center justify-end gap-5">
              {user ? (
                <UserDropdown
                  email={user.email as string}
                  name={user.given_name as string}
                  userImage={
                    user.picture ??
                    `https://avatar.vercel.sh/${user.given_name}`
                  }
                />
              ) : (
                <Link
                  href="/api/auth/login"
                  className="hidden md:flex text-neutral-700 hover:text-black transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </Link>
              )}

              <Link
                href="/search"
                className="text-neutral-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" strokeWidth={1.5} />
              </Link>

              <CartSheet />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Row with Mega Dropdowns */}
      <NavMenu />
    </div>
  );
}
