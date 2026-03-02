"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface ProductCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    finalPrice: number;
    originalPrice: number;
    images: string[];
    rating: number;
    reviews: number;
    isBestSeller: boolean | null;
  };
}

export function ProductCard({ item }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const discount = Math.round(((item.originalPrice - item.finalPrice) / item.originalPrice) * 100);

  return (
    <Link href={`/product/${item.id}`} className="group block">
      {/* Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
        onMouseEnter={() => {
          if (item.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        {item.isBestSeller && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase tracking-[0.1em] px-2 py-1 z-10 font-medium">
            Best Seller
          </span>
        )}

        <Image
          src={item.images[currentImageIndex] || item.images[0]}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? "fill-black text-black" : "text-neutral-600"}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-xs uppercase tracking-[0.05em] font-medium text-neutral-800 line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">₹{item.finalPrice}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-neutral-400 line-through">₹{item.originalPrice}</span>
              <span className="text-xs text-neutral-500">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function LoadingProductCard() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
