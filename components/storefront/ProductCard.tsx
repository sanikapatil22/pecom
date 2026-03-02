"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star } from "lucide-react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const discount = Math.round(((item.originalPrice - item.finalPrice) / item.originalPrice) * 100);

  return (
    <motion.div
      className="w-full max-w-[400px] h-[700px] overflow-hidden rounded-2xl mb-4 pb-5 bg-white shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div
        className="relative h-[80%] overflow-hidden cursor-pointer"
        onMouseMove={nextImage}
      >
        {item.isBestSeller && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-sm px-3 py-1 rounded-md z-10 font-medium">
            BEST SELLER
          </span>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={item.images[currentImageIndex]}
              alt={`${item.name} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover p-1 rounded-2xl"
              sizes="(max-width: 600px) 100vw, 500px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-md px-3 py-1.5">
          <Star className="w-5 h-5 fill-black text-black" />
          <span className="text-base font-medium">{item.rating}</span>
          <span className="text-base text-gray-600">({item.reviews})</span>
        </div>

        {/* Hover Content */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-x-0 bottom-0 p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm line-clamp-2 mb-4 opacity-90">{item.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="p-6 h-[20%] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">₹{item.finalPrice}</span>
            <span className="text-gray-500 line-through text-base">₹{item.originalPrice}</span>
            <span className="text-green-600 text-base font-medium">{discount}% OFF</span>
          </div>
          <h3 className="text-base text-gray-600 line-clamp-1">{item.name}</h3>
        </div>

        <div className="flex gap-3 mt-2 mb-1">
          <Button
            className="flex-1 bg-white hover:bg-gray-100 text-black border border-gray-200 text-base py-6"
            asChild
          >
            <Link href={`/product/${item.id}`}>
              ADD TO CART
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-200 h-[48px] w-[48px]"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function LoadingProductCard() {
  return (
    <div className="w-full max-w-[400px] h-[700px] overflow-hidden rounded-2xl mb-4 pb-5 bg-white shadow-lg">
      <div className="relative h-[80%]">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-6 h-[20%]">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex gap-3 mt-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}
