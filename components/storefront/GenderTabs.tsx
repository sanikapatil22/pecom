"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const colorMap: Record<string, string> = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  GRAY: "#808080",
  RED: "#DC2626",
  BLUE: "#2563EB",
  GREEN: "#16A34A",
  YELLOW: "#EAB308",
  PURPLE: "#9333EA",
  PINK: "#EC4899",
  ORANGE: "#EA580C",
  NAVY: "#1E3A5F",
  BROWN: "#78350F",
  MULTICOLOR: "conic-gradient(red, yellow, green, blue, purple, red)",
  DUSTY_GREEN: "#6B8E6B",
  MAROON: "#800000",
  COOKIE: "#C68E4E",
  BEIGE: "#D4B896",
  SKY_BLUE: "#7DD3FC",
  LIGHT_GREEN: "#86EFAC",
  KHAKI: "#BDB76B",
};

interface GenderProduct {
  id: string;
  name: string;
  images: string[];
  finalPrice: number;
  originalPrice: number;
  variants: { color: string }[];
}

interface GenderTabsProps {
  menProducts: GenderProduct[];
}

export type { GenderProduct };

export function ProductCard({ product }: { product: GenderProduct }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const images = product.images;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area — button lives outside Link so clicks don't navigate */}
      <div className="relative w-full overflow-hidden bg-neutral-100 aspect-[3/4]">
        <Link href={`/product/${product.id}`} className="absolute inset-0">
          <Image
            src={images[imageIndex]}
            alt={product.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </Link>

        {/* Next image arrow — outside Link, won't navigate */}
        {images.length > 1 && hovered && (
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" strokeWidth={2.5} />
          </button>
        )}

        {/* Image dots indicator */}
        {images.length > 1 && hovered && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === imageIndex ? "bg-black" : "bg-black/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Text info — clicking navigates to product */}
      <Link href={`/product/${product.id}`}>
        <div className="mt-3 space-y-1 text-center px-1">
          <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-neutral-900 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="text-sm font-bold text-neutral-900">{formatPrice(product.finalPrice)}</span>
            {product.originalPrice > product.finalPrice && (
              <span className="text-xs text-neutral-400 line-through font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {uniqueColors.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {uniqueColors.map((color) => (
                <span
                  key={color}
                  className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-sm"
                  style={{
                    background:
                      color === "MULTICOLOR"
                        ? colorMap.MULTICOLOR
                        : colorMap[color] || "#ccc",
                  }}
                  title={color.replace(/_/g, " ")}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function GenderTabs({ menProducts }: GenderTabsProps) {
  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="flex items-center justify-center mb-10">
        <h2 className="text-lg md:text-xl uppercase tracking-[0.2em] font-semibold text-black border-b-2 border-black pb-1">
          For Him
        </h2>
      </div>

      {/* Products Grid — 4 columns */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12">
          {menProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-14 mb-4">
          <Link
            href="/collections/men"
            className="relative overflow-hidden bg-black text-white text-sm uppercase tracking-[0.2em] font-semibold px-12 py-4 border border-black group/btn [&>span]:relative [&>span]:z-10 hover:text-black transition-colors duration-500 before:absolute before:inset-0 before:bg-white before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-500 before:ease-out"
          >
            <span>All For Him</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
