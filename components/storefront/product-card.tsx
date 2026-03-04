"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface ProductCardProps {
  id?: string;
  title: string;
  description?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  imageUrl: string | string[];
  isBestSeller?: boolean | null;
  tagline: string;
}

export function ProductCard1({
  id = "",
  title,
  price,
  originalPrice,
  rating,
  reviews,
  imageUrl,
  isBestSeller,
  tagline
}: ProductCardProps) {
  const images = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
  const [currentImage, setCurrentImage] = useState(0);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  const formattedOriginalPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(originalPrice);

  return (
    <Link href={`/product/${id}`} className="group block">
      <div
        className="relative overflow-hidden bg-neutral-100 aspect-[3/4]"
        onMouseEnter={() => {
          if (images.length > 1) setCurrentImage(1);
        }}
        onMouseLeave={() => setCurrentImage(0)}
      >
        {isBestSeller && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase tracking-[0.1em] px-2 py-1 z-10 font-medium">
            Best Seller
          </span>
        )}
        <Image
          src={images[currentImage] || images[0]}
          alt={title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority
        />
        {images.length > 1 && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentImage((prev) => (prev + 1) % images.length);
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div className="mt-3 space-y-1 text-center px-1">
        <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-neutral-900 line-clamp-1">
          {title}
        </h3>
        <p className="text-[10px] text-neutral-400 line-clamp-1 uppercase tracking-widest">{tagline}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
          <span className="text-sm font-bold text-neutral-900">{formattedPrice}</span>
          {formattedOriginalPrice !== formattedPrice && (
            <>
              <span className="text-xs text-neutral-400 line-through font-normal">{formattedOriginalPrice}</span>
              <span className="text-xs text-neutral-500 font-medium">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
