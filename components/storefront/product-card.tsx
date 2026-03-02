"use client";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
  const formattedOriginalPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(originalPrice);

  return (
    <Link href={`/product/${id}`}>
      <Card className="w-full max-w-[400px] overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg group hover:scale-[1.02]">
        <div className="relative w-full" style={{ height: "280px" }}>
          {isBestSeller && (
            <span className="absolute top-2 left-2 bg-violet-500 text-white text-xs px-2 py-0.5 rounded-md z-10 font-medium">
              BEST SELLER
            </span>
          )}
          <div className="h-full w-full flex items-center justify-center bg-gray-50">
            <Image
              src={images[0]}
              alt={title}
              className="object-contain transition-transform duration-300 group-hover:scale-105 max-h-full"
              width={280}
              height={280}
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm md:text-base font-bold line-clamp-1">{title}</h3>
            {rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 md:w-4 md:h-4 fill-black text-black" />
                <span className="text-xs md:text-sm font-medium">{rating}</span>
                {reviews > 0 && <span className="text-xs text-gray-500">({reviews})</span>}
              </div>
            )}
          </div>
          <p className="text-[10px] md:text-xs line-clamp-1 text-gray-500 mb-1">{tagline}</p>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs md:text-sm font-semibold">{formattedPrice}</span>
            {formattedOriginalPrice !== formattedPrice && (
              <>
                <span className="text-xs md:text-sm text-gray-500 line-through">{formattedOriginalPrice}</span>
                <span className="text-xs md:text-sm text-green-600 font-medium">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}