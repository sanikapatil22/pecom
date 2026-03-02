"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
        className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
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
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-xs uppercase tracking-[0.05em] font-medium text-neutral-800 line-clamp-1">
          {title}
        </h3>
        <p className="text-[10px] text-neutral-400 line-clamp-1 uppercase tracking-wider">{tagline}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium">{formattedPrice}</span>
          {formattedOriginalPrice !== formattedPrice && (
            <>
              <span className="text-xs text-neutral-400 line-through">{formattedOriginalPrice}</span>
              <span className="text-xs text-neutral-500">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
