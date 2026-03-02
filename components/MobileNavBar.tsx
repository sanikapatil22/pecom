"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavItem from "./NavItem";
import Link from "next/link";

const MEN_SECTIONS = [
  {
    name: "T Shirts",
    href: "/collections/t-shirts",
    description: "Complete t-shirt collection",
  },
  {
    name: "Tanks",
    href: "/collections/tanks",
    description: "Amazing collection of tanks",
  },
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
];

const MobileNavbar = () => {
  const { user } = useKindeBrowserClient();

  return (
    <div className="md:hidden block">
      <Sheet>
        <SheetTrigger asChild>
          <button className="text-neutral-700 hover:text-black transition-colors">
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col gap-0 p-0 pt-12 w-[300px]"
        >
          <nav className="flex flex-col">
            <SheetClose asChild>
              <Link
                href="/"
                className="px-6 py-3 text-sm uppercase tracking-[0.15em] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors border-b border-neutral-100"
              >
                Home
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/collections/all-products"
                className="px-6 py-3 text-sm uppercase tracking-[0.15em] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors border-b border-neutral-100"
              >
                All Products
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/products/new"
                className="px-6 py-3 text-sm uppercase tracking-[0.15em] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors border-b border-neutral-100"
              >
                New
              </Link>
            </SheetClose>
            {user && (
              <SheetClose asChild>
                <Link
                  href="/my-orders"
                  className="px-6 py-3 text-sm uppercase tracking-[0.15em] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors border-b border-neutral-100"
                >
                  My Orders
                </Link>
              </SheetClose>
            )}
            {user && (
              <SheetClose asChild>
                <Link
                  href="/wishlist"
                  className="px-6 py-3 text-sm uppercase tracking-[0.15em] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors border-b border-neutral-100"
                >
                  Wishlist
                </Link>
              </SheetClose>
            )}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="mens" className="border-b border-neutral-100">
                <AccordionTrigger className="px-6 py-3 text-sm uppercase tracking-[0.15em] font-medium text-neutral-700 hover:no-underline">
                  Men
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col bg-neutral-50">
                    {MEN_SECTIONS.map((section) => (
                      <SheetClose key={section.href} asChild>
                        <Link
                          href={section.href}
                          className="px-8 py-2.5 text-sm text-neutral-600 hover:text-black transition-colors"
                        >
                          {section.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {!user && (
              <div className="mt-6 px-6 space-y-2">
                <SheetClose asChild>
                  <Link
                    href="/api/auth/login"
                    className="block w-full text-center py-2.5 text-sm uppercase tracking-[0.15em] font-medium bg-black text-white hover:bg-neutral-800 transition-colors"
                  >
                    Login
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/api/auth/register"
                    className="block w-full text-center py-2.5 text-sm uppercase tracking-[0.15em] font-medium border border-black text-black hover:bg-black hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </SheetClose>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
