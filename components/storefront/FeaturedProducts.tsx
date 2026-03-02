"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { getFeaturedProducts } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  originalPrice: number;
  finalPrice: number;
  variants: ProductVariant[];
}

const FeaturedProductCard = ({ item }: { item: Product }) => {
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(((item.originalPrice - item.finalPrice) / item.originalPrice) * 100);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/product/${item.id}`} className="group block flex-shrink-0 w-64 md:w-72">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={hovered && item.images.length > 1 ? item.images[1] : item.images[0]}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="300px"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase tracking-[0.1em] px-2 py-1 font-medium">
            {discount}% off
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-xs uppercase tracking-[0.05em] font-medium text-neutral-800 line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{formatPrice(item.finalPrice)}</span>
          {discount > 0 && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const LoadingProductCard = () => {
  return (
    <div className="flex-shrink-0 w-64 md:w-72">
      <div className="aspect-[3/4] bg-neutral-100 animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-neutral-100 w-3/4" />
        <div className="h-4 bg-neutral-100 w-1/2" />
      </div>
    </div>
  );
};

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await getFeaturedProducts();
        if (!response) {
          setError("No products found");
          return;
        }
        setProducts(response);
      } catch (err) {
        setError("Failed to load featured products");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (error || (!isLoading && products.length === 0)) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading !text-left">Featured</h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 border border-neutral-200 flex items-center justify-center hover:border-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 border border-neutral-200 flex items-center justify-center hover:border-black transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? [1, 2, 3, 4, 5].map((i) => <LoadingProductCard key={i} />)
            : products.map((item) => <FeaturedProductCard key={item.id} item={item} />)
          }
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
