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

const MEN_SECTIONS = [
  {
    name: "T Shirts",
    href: "/collections/t-shirts",
    description: "Complete t-shirt collection",
  },
  // Remove or comment out the separate oversized section
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
          <button className="text-white hover:text-gray-200 transition-colors">
            <Menu className="w-8 h-8" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col gap-6 p-6 pt-16"
        >
          <nav className="flex flex-col gap-4">
            <SheetClose asChild>
              <NavItem href="/">Home</NavItem>
            </SheetClose>
            <SheetClose asChild>
              <NavItem href="/collections/all-products">All Products</NavItem>
            </SheetClose>
            <SheetClose asChild>
              <NavItem href="/products/new">New</NavItem>
            </SheetClose>
            {user && (
              <SheetClose asChild>
                <NavItem href="/my-orders">My Orders</NavItem>
              </SheetClose>
            )}
            {user && (
              <SheetClose asChild>
                <NavItem href="/wishlist">Wishlist</NavItem>
              </SheetClose>
            )}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="mens" className="border-b">
                <AccordionTrigger className="font-medium">
                  Mens
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pt-2">
                    {MEN_SECTIONS.map((section) => (
                      <SheetClose key={section.href} asChild>
                        <NavItem href={section.href}>
                          {section.name}
                        </NavItem>
                      </SheetClose>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
