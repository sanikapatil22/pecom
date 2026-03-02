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
  Flame,
  Heart,
  ShoppingBag,
  Percent,
  Gift,
  Clock,
  Star,
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
        href: "/collections/t-shirts", // This will now show both regular and oversized
        description: "Curated collection of all t-shirts",
      },
      // Remove or comment out the separate oversized t-shirts section
      // {
      //   name: "Oversized T Shirts",
      //   href: "/collections/oversized-tshirts",
      //   description: "Curated collection of oversized t-shirts",
      // },
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

const womenSections = [
  {
    title: "Shop Categories",
    items: [
      {
        name: "New Arrivals",
        href: "/products/women/new-arrivals",
        icon: <Star className="h-5 w-5" />,
        description: "Latest additions to our collection",
      },
      {
        name: "Sale Items",
        href: "/products/women/sale",
        icon: <Percent className="h-5 w-5" />,
        description: "Discounted items and special offers",
      },
      {
        name: "Best Sellers",
        href: "/products/women/best-sellers",
        icon: <ShoppingBag className="h-5 w-5" />,
        description: "Most popular items this season",
      },
    ],
  },
  {
    title: "Clothing",
    items: [
      {
        name: "All Clothing",
        href: "/products/women/clothing",
        icon: <Gift className="h-5 w-5" />,
        description: "Browse our full collection",
      },
      {
        name: "Limited Edition",
        href: "/products/women/limited-edition",
        icon: <Clock className="h-5 w-5" />,
        description: "Exclusive items for a limited time",
      },
    ],
  },
];

const accessoriesSections = [
  {
    title: "Categories",
    items: [
      {
        name: "Bags & Wallets",
        href: "/products/accessories/bags",
        icon: <ShoppingBag className="h-5 w-5" />,
        description: "Stylish bags for every occasion",
      },
      {
        name: "Jewelry",
        href: "/products/accessories/jewelry",
        icon: <Star className="h-5 w-5" />,
        description: "Elegant jewelry pieces",
      },
    ],
  },
  {
    title: "Featured",
    items: [
      {
        name: "New Arrivals",
        href: "/products/accessories/new",
        icon: <Gift className="h-5 w-5" />,
        description: "Latest accessories",
      },
      {
        name: "Sale Items",
        href: "/products/accessories/sale",
        icon: <Percent className="h-5 w-5" />,
        description: "Special offers on accessories",
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
      {/* Top Banner */}
      {(
        <div className="w-full bg-zinc-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center items-center h-8">
              <span className="text-[10px] tracking-[0.1em] uppercase font-medium">
                {!user ? "Sign up for faster checkout & easy returns" : "Summer Sale is Live. Upto 40% off"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="w-full bg-zinc-900 text-white border-t border-zinc-800">
        <div className="mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center h-full">
              <MobileNavbar />
              {/* Left Section: Logo and Nav Links */}
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 md:mr-12 mx-3">
                <Image
                  src="/Pamara2.png"
                  alt="pamara logo"
                  width={45}
                  height={45}
                  className="h-8 w-auto"
                />
              </Link>

              {/* Main Nav Links */}
              <div className="md:flex hidden h-full md:space-x-2 space-x-4">
                <Link
                  href="/collections/all-products"
                  className="flex items-center md:px-4 h-full text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  All
                </Link>

                <Link
                  href="/products/new"
                  className="flex items-center md:px-4 h-full text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  New <Flame className="ml-1 h-4 w-4 text-orange-500" />
                </Link>

                <div className="md:block hidden">
                  <NavbarDropdown title="Men">
                    <NavbarDropdownContent sections={menSections} />
                  </NavbarDropdown>
                </div>

                {/* <NavbarDropdown title="Women">
                  <NavbarDropdownContent sections={womenSections} />
                </NavbarDropdown>

                <NavbarDropdown title="Accessories">
                  <NavbarDropdownContent sections={accessoriesSections} />
                </NavbarDropdown> */}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center md:space-x-8 space-x-6">
              {/* Search */}
              <div className="hidden md:block">
                <Search />
              </div>
              <div className="md:hidden block">
                <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </Link>
              </div>

              {/* Wishlist */}
              {user && (
                <div className="md:flex hidden items-center gap-8">
                  <Link
                    href="/wishlist"
                    className="text-gray-300 hover:text-white transition-colors relative"
                    aria-label="Wishlist"
                  >
                    <Heart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {user && (
                <div className="md:flex hidden items-center gap-8">
                  <Link
                    href="/my-orders"
                    className="text-gray-300 hover:text-white transition-colors relative"
                    aria-label="Wishlist"
                  >
                    <PackageOpen className="w-5 h-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {/* Cart */}
              <CartSheet />

              {/* User Account / Login / Register */}
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
                <div className="flex items-center md:space-x-4 space-x-1">
                  <Link
                    href="/api/auth/login"
                    className={buttonVariants({
                      variant: "ghost",
                      className:
                        "text-gray-200 hover:text-white hover:bg-zinc-800/50 md:text-base text-xs",
                    })}
                  >
                    Login
                  </Link>
                  <Link
                    href="/api/auth/register"
                    className={buttonVariants({
                      variant: "ghost",
                      className:
                        "text-gray-200 hover:text-white hover:bg-zinc-800/50 md:text-base text-xs",
                    })}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav >
    </div >
  );
}
