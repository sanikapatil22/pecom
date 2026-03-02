"use server";
import Link from "next/link";
import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserDropdown } from "./UserDropdown";
import { buttonVariants } from "@/components/ui/button";
import CartSheet, { Cart } from "./BagSheet";
import {
  NavbarDropdown,
  NavbarDropdownContent,
} from "@/components/NavbarDrop-down";
import {
  Heart,
  ShoppingBag,
  PackageOpen,
} from "lucide-react";
import { redis } from "@/app/lib/redis";
import Search from "../Search";
import MobileNavbar from "../MobileNavBar";

const menSections = [
  {
    items: [
      {
        name: "T Shirts",
        href: "/collections/t-shirts",
        description: "Curated collection of all t-shirts",
      },
      {
        name: "Tanks",
        href: "/collections/tanks",
        description: "Amazing collection of tanks",
      },
    ],
  },
  {
    items: [
      {
        name: "Hoodies",
        href: "/collections/hoodies",
        description: "Browse our full collection",
      },
      {
        name: "Joggers",
        href: "/collections/joggers",
        description: "Exclusive items for a limited time",
      },
    ],
  },
];

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

      {/* Main Navigation */}
      <nav className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="h-14 grid grid-cols-3 items-center">
            {/* Left: Nav Links */}
            <div className="hidden md:flex items-center gap-1 h-full">
              <Link
                href="/collections/all-products"
                className="px-3 h-full flex items-center text-xs uppercase tracking-[0.15em] font-medium text-neutral-700 hover:text-black transition-colors"
              >
                All
              </Link>
              <Link
                href="/products/new"
                className="px-3 h-full flex items-center text-xs uppercase tracking-[0.15em] font-medium text-neutral-700 hover:text-black transition-colors"
              >
                New
              </Link>
              <NavbarDropdown title="Men">
                <NavbarDropdownContent sections={menSections} />
              </NavbarDropdown>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <MobileNavbar />
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/Pamara2.png"
                  alt="PAMARA"
                  width={120}
                  height={40}
                  className="h-8 w-auto invert"
                  priority
                />
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center justify-end gap-5">
              {/* Search - desktop */}
              <div className="hidden md:block">
                <Search />
              </div>
              {/* Search - mobile */}
              <Link
                href="/search"
                className="md:hidden text-neutral-700 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Link>

              {/* Wishlist */}
              {user && (
                <Link
                  href="/wishlist"
                  className="hidden md:flex text-neutral-700 hover:text-black transition-colors relative"
                  aria-label="Wishlist"
                >
                  <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* My Orders */}
              {user && (
                <Link
                  href="/my-orders"
                  className="hidden md:flex text-neutral-700 hover:text-black transition-colors"
                  aria-label="My Orders"
                >
                  <PackageOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </Link>
              )}

              {/* Cart */}
              <CartSheet />

              {/* Auth */}
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
                <div className="hidden md:flex items-center gap-1">
                  <Link
                    href="/api/auth/login"
                    className="text-xs uppercase tracking-[0.1em] font-medium text-neutral-700 hover:text-black px-2 py-1 transition-colors"
                  >
                    Login
                  </Link>
                  <span className="text-neutral-300">|</span>
                  <Link
                    href="/api/auth/register"
                    className="text-xs uppercase tracking-[0.1em] font-medium text-neutral-700 hover:text-black px-2 py-1 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
