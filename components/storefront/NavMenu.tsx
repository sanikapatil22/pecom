"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface DropdownLink {
  name: string;
  href: string;
}

interface DropdownColumn {
  heading: string;
  links: DropdownLink[];
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: {
    columns: DropdownColumn[];
    image?: {
      src: string;
      alt: string;
      caption: string;
    };
  };
}

const navItems: NavItem[] = [
  {
    label: "All Products",
    href: "/collections/all-products",
    dropdown: {
      columns: [
        {
          heading: "Products",
          links: [
            { name: "T-Shirts", href: "/collections/t-shirts" },
            { name: "Tanks", href: "/collections/tanks" },
            { name: "Hoodies", href: "/collections/hoodies" },
            { name: "Shorts", href: "/collections/shorts" },
            { name: "Joggers", href: "/collections/joggers" },
            { name: "Outerwear", href: "/collections/outerwear" },
            { name: "Oversized", href: "/collections/oversized-tshirts" },
            { name: "Accessories", href: "/collections/accessories" },
            { name: "All Products", href: "/collections/all-products" },
          ],
        },
      ],
      image: {
        src: "/men.jpeg",
        alt: "Men's Collection",
        caption: "MEN'S DROP",
      },
    },
  },
  {
    label: "New Drop",
    href: "/collections/all-products",
    dropdown: {
      columns: [
        {
          heading: "New Arrivals",
          links: [
            { name: "All New", href: "/collections/all-products" },
            { name: "T-Shirts", href: "/collections/t-shirts" },
            { name: "Hoodies", href: "/collections/hoodies" },
            { name: "Joggers", href: "/collections/joggers" },
            { name: "Tanks", href: "/collections/tanks" },
            { name: "Oversized", href: "/collections/oversized-tshirts" },
          ],
        },
        {
          heading: "Trending",
          links: [
            { name: "Outerwear", href: "/collections/outerwear" },
            { name: "Accessories", href: "/collections/accessories" },
          ],
        },
      ],
    },
  },
  {
    label: "T-Shirts",
    href: "/collections/t-shirts",
    dropdown: {
      columns: [
        {
          heading: "T-Shirts",
          links: [
            { name: "All T-Shirts", href: "/collections/t-shirts" },
            { name: "Oversized", href: "/collections/oversized-tshirts" },
            { name: "Boxy Fit", href: "/collections/t-shirts" },
            { name: "Regular Fit", href: "/collections/t-shirts" },
          ],
        },
      ],
    },
  },
  {
    label: "Hoodies",
    href: "/collections/hoodies",
    dropdown: {
      columns: [
        {
          heading: "Hoodies",
          links: [
            { name: "All Hoodies", href: "/collections/hoodies" },
            { name: "Zip-Up", href: "/collections/hoodies" },
            { name: "Pullover", href: "/collections/hoodies" },
          ],
        },
      ],
    },
  },
  {
    label: "Joggers",
    href: "/collections/joggers",
    dropdown: {
      columns: [
        {
          heading: "Joggers",
          links: [
            { name: "All Joggers", href: "/collections/joggers" },
            { name: "Shorts", href: "/collections/shorts" },
          ],
        },
      ],
    },
  },
  {
    label: "Tanks",
    href: "/collections/tanks",
    dropdown: {
      columns: [
        {
          heading: "Tanks",
          links: [
            { name: "All Tanks", href: "/collections/tanks" },
            { name: "Stringers", href: "/collections/tanks" },
            { name: "Cutoffs", href: "/collections/tanks" },
          ],
        },
      ],
    },
  },
];

export default function NavMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(index);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenIndex(null);
    }, 150);
  };

  return (
    <div className="hidden md:block w-full bg-white border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex justify-center items-center gap-8 h-10">
          {navItems.map((item, index) => (
            <div
              key={item.label}
              className="relative h-full flex items-center"
              onMouseEnter={() => handleEnter(index)}
              onMouseLeave={handleLeave}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
                  openIndex === index
                    ? "text-black"
                    : "text-neutral-700 hover:text-black"
                }`}
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown className="w-3 h-3" strokeWidth={2} />
                )}
              </Link>

              {/* Underline indicator */}
              {openIndex === index && item.dropdown && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mega Dropdown */}
      {openIndex !== null && navItems[openIndex]?.dropdown && (
        <div
          className="absolute left-0 right-0 bg-white border-b border-neutral-200 shadow-sm z-50"
          onMouseEnter={() => handleEnter(openIndex)}
          onMouseLeave={handleLeave}
        >
          <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-3 gap-8">
            {/* Text columns */}
            <div className="col-span-2 grid grid-cols-2 gap-8">
              {navItems[openIndex].dropdown!.columns.map((col) => (
                <div key={col.heading}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black mb-5">
                    {col.heading}
                  </h3>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-neutral-500 hover:text-black transition-colors"
                          onClick={() => setOpenIndex(null)}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Image */}
            {navItems[openIndex].dropdown!.image && (
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <Image
                    src={navItems[openIndex].dropdown!.image!.src}
                    alt={navItems[openIndex].dropdown!.image!.alt}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-3 text-center">
                  {navItems[openIndex].dropdown!.image!.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
