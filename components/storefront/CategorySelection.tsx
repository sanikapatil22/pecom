"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Category } from "@prisma/client";

interface FeaturedProduct {
  category: Category;
  product: Product;
}

interface CategoriesSectionProps {
  featuredProducts: FeaturedProduct[];
}

const categoryDisplayNames: Record<string, string> = {
  TANKS: "Tanks",
  T_SHIRTS: "Shirts",
  HOODIES: "Hoodies",
  SHORTS: "Shorts",
  JEANS: "Jeans",
  OUTERWEAR: "Outerwear",
  JOGGERS: "Joggers",
  OVERSIZED_TSHIRTS: "Oversized",
  ACCESSORIES: "Accessories",
  ALL_PRODUCTS: "All Products",
};

const categoryUrls: Record<string, string> = {
  TANKS: "tanks",
  T_SHIRTS: "t-shirts",
  HOODIES: "hoodies",
  SHORTS: "shorts",
  JEANS: "jeans",
  OUTERWEAR: "outerwear",
  JOGGERS: "joggers",
  OVERSIZED_TSHIRTS: "oversized-tshirts",
  ACCESSORIES: "accessories",
  ALL_PRODUCTS: "all-products",
};

const categoryFallbackImages: Record<string, string> = {
  TANKS: "/tank.webp",
  T_SHIRTS: "/polo.webp",
  HOODIES: "/all.jpeg",
  SHORTS: "/men.jpeg",
  JEANS: "/men.jpeg",
  OUTERWEAR: "/Regular-Polo.jpg",
  JOGGERS: "/joggers.webp",
  OVERSIZED_TSHIRTS: "/oversized.webp",
  ACCESSORIES: "/all-products.webp",
  ALL_PRODUCTS: "/all-products.webp",
};

const displayCategories: Category[] = [
  Category.T_SHIRTS,
  Category.JOGGERS,
  Category.OUTERWEAR,
  Category.OVERSIZED_TSHIRTS,
  Category.HOODIES,
  Category.TANKS,
  Category.SHORTS,
  Category.ACCESSORIES,
];

const CategoriesSection = ({ featuredProducts }: CategoriesSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) ref.addEventListener("scroll", checkScroll);
    return () => {
      if (ref) ref.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const productMap = new Map(
    featuredProducts.map((fp) => [fp.category, fp])
  );

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    // Scroll the full visible width (all 4 cards at once)
    const scrollAmount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-black relative">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto py-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {displayCategories.map((cat) => {
          const fp = productMap.get(cat);
          const imageSrc =
            fp?.product?.images?.[0] || categoryFallbackImages[cat] || "/all-products.webp";
          const displayName = categoryDisplayNames[cat] || cat;
          const url = categoryUrls[cat] || cat.toLowerCase().replace(/_/g, "-");

          return (
            <Link
              key={cat}
              href={`/collections/${url}`}
              className="relative flex-shrink-0 overflow-hidden group block"
              style={{
                width: "calc(25% - 6px)",
                minWidth: "280px",
                height: "75vh",
              }}
            >
              {/* Image */}
              <Image
                src={imageSrc}
                alt={displayName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
              />

              {/* Subtle bottom gradient for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Content — bottom left */}
              <div className="absolute bottom-0 left-0 p-5 md:p-7">
                <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] mb-4">
                  {displayName}
                </h3>
                <span className="inline-block border border-white bg-white text-black text-[11px] md:text-xs uppercase tracking-[0.15em] font-semibold px-5 md:px-6 py-2 md:py-2.5 group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
                  View Products
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-black" strokeWidth={2} />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-black" strokeWidth={2} />
        </button>
      )}
    </section>
  );
};

export default CategoriesSection;
