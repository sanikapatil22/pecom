"use client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  Heart,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addItem, addItemWishlist, deleteReview } from "@/app/actions";
import { Color } from "@prisma/client";
import BeatLoader from "react-spinners/BeatLoader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Prisma } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import ReviewDialog from "./ReviewDialog";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { buyNow } from "@/app/actions";
import SizeChartDialog from "./SizeChartDialog";

type Product = Prisma.ProductGetPayload<{
  include: {
    reviews: {
      include: {
        user: true;
      };
    };
    variants: true;
  };
}>;

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

interface iAppProps {
  data: Product;
}

const colorMap = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  GRAY: "#808080",
  RED: "#FF0000",
  BLUE: "#0000FF",
  GREEN: "#008000",
  YELLOW: "#FFD700",
  PURPLE: "#800080",
  PINK: "#FFC0CB",
  ORANGE: "#FFA500",
  NAVY: "#000080",
  BROWN: "#8B4513",
  MULTICOLOR: "linear-gradient(45deg, #FF0000, #00FF00, #0000FF)",
  DUSTY_GREEN: "#8F9779",
  MAROON: "#800000",
  COOKIE: "#D2691E",
  BEIGE: "#F5F5DC",
  SKY_BLUE: "#87CEEB",
  LIGHT_GREEN: "#90EE90",
  KHAKI: "#F0E68C",
};

export default function ProductDetails({ data }: iAppProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    data.variants[0].size
  );
  const [isLiked, setIsLiked] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    data.variants[0].color
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === data.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1
    );
  };

  const getAvailableColorsForSize = (size: Size): Color[] => {
    return data.variants
      .filter((variant) => variant.size === size && variant.stock > 0)
      .map((variant) => variant.color);
  };

  const isColorAvailableForSize = (color: Color, size: Size): boolean => {
    return data.variants.some(
      (variant) =>
        variant.color === color && variant.size === size && variant.stock > 0
    );
  };

  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size);
    if (selectedColor && !isColorAvailableForSize(selectedColor, size)) {
      const availableColors = getAvailableColorsForSize(size);
      if (availableColors.length > 0) {
        setSelectedColor(availableColors[0]);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyNow = async () => {
    setIsLoading(true);
    if (!selectedSize || !selectedColor) {
      setIsLoading(false);
      toast({
        title: "Please select both size and color",
        variant: "destructive",
      });
      return;
    }
    if (!user) {
      setIsLoading(false);
      toast({
        title: "Please login to continue",
        description: "You need to be logged in to make a purchase",
        action: (
          <ToastAction altText="Login">
            <Link href="/api/auth/login">Login</Link>
          </ToastAction>
        ),
      });
      return;
    }
    const res = await buyNow(data.id, selectedSize, selectedColor);

    if (res?.error) {
      toast({
        variant: "destructive",
        title: "Oops",
        description: "Failed to make purchase. Please try again.",
      });
      setIsLoading(false);
    } else {
      router.push("/checkout");
      setIsLoading(false);
    }
  };

  const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

  const getStockForSize = (size: Size) => {
    const variant = data.variants.find((v) => v.size === size);
    return variant?.stock || 0;
  };

  const isSizeAvailable = (size: Size) => {
    return getStockForSize(size) > 0;
  };

  const [addingToBag, startAddingToBagTransition] = useTransition();

  const addProducttoShoppingCart = async (formData: FormData) => {
    startAddingToBagTransition(async () => {
      if (!selectedSize || !selectedColor) return;

      if (!user) {
        toast({
          title: "Oops",
          description: "Please login to add item to cart.",
          action: (
            <ToastAction altText="Login">
              <Link href="/api/auth/login">Login</Link>
            </ToastAction>
          ),
        });
        return;
      }

      const result = await addItem(data.id, selectedSize, selectedColor);

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Oops",
          description: "Failed to add item to cart. Please try again.",
        });
      } else {
        toast({
          title: "Added to bag",
          description: "Item successfully added to your bag",
        });
      }
    });
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Oops",
        description: "Please login to add item to favorites.",
        action: (
          <ToastAction altText="Login">
            <Link href="/api/auth/login">Login</Link>
          </ToastAction>
        ),
      });
      return;
    }
    await addItemWishlist(data.id);
    setIsLiked(true);
  };

  const displayedReviews = data.reviews.slice(
    0,
    showAllReviews ? undefined : 3
  );

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      router.refresh();
      toast({
        title: "Review deleted",
        description: "The review has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the review.",
        variant: "destructive",
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const discount = Math.round(
    ((data.originalPrice - data.finalPrice) / data.originalPrice) * 100
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Images */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            <Image
              src={data.images[currentImageIndex]}
              alt={data.name}
              fill
              quality={95}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {data.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto">
            {data.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative w-16 h-20 flex-shrink-0 bg-neutral-100 overflow-hidden border-2 transition-colors",
                  currentImageIndex === index
                    ? "border-black"
                    : "border-transparent hover:border-neutral-300"
                )}
              >
                <Image
                  src={image}
                  alt={`${data.name} view ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:py-4">
          {/* Title & Price */}
          <div className="space-y-4">
            {data.isBestSeller && (
              <span className="inline-block text-[10px] uppercase tracking-[0.15em] font-medium bg-black text-white px-3 py-1">
                Best Seller
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-medium uppercase tracking-[0.05em]">
              {data.name}
            </h1>
            <p className="text-sm text-neutral-500">{data.headline}</p>

            <div className="flex items-baseline gap-3">
              <span className="text-xl font-medium">
                {formatPrice(data.finalPrice)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-base text-neutral-400 line-through">
                    {formatPrice(data.originalPrice)}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-neutral-500">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider">
              Inclusive of all taxes
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 my-6" />

          {/* Color Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-[0.15em] font-medium">
                Color
              </h3>
              {selectedColor && (
                <span className="text-xs text-neutral-400 uppercase tracking-wider">
                  {selectedColor.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {Array.from(
                new Set(data.variants.map((variant) => variant.color))
              ).map((color, index) => {
                const isAvailable = selectedSize
                  ? isColorAvailableForSize(color, selectedSize)
                  : data.variants.some(
                      (v) => v.color === color && v.stock > 0
                    );

                return (
                  <TooltipProvider key={index}>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedColor(color)}
                          disabled={!isAvailable}
                          className={cn(
                            "w-7 h-7 border transition-all duration-200",
                            selectedColor === color
                              ? "ring-1 ring-black ring-offset-2"
                              : "hover:scale-110",
                            !isAvailable &&
                              "opacity-30 cursor-not-allowed hover:scale-100",
                            [
                              "WHITE",
                              "BEIGE",
                              "LIGHT_GREEN",
                              "SKY_BLUE",
                              "KHAKI",
                            ].includes(color) && "border-neutral-300"
                          )}
                          style={{
                            background:
                              color === "MULTICOLOR"
                                ? colorMap[color]
                                : colorMap[color] || color.toLowerCase(),
                            borderColor: [
                              "WHITE",
                              "BEIGE",
                              "LIGHT_GREEN",
                              "SKY_BLUE",
                              "KHAKI",
                            ].includes(color)
                              ? "#d4d4d4"
                              : colorMap[color] || color.toLowerCase(),
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white px-3 py-1.5 text-xs border">
                        <p>
                          {color.replace(/_/g, " ")}
                          {!isAvailable && " (Unavailable)"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.15em] font-medium">
                Size
              </h3>
              <SizeChartDialog type={data.category} />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {ALL_SIZES.map((size) => {
                const stock = getStockForSize(size);
                const available = isSizeAvailable(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    disabled={!available}
                    className={cn(
                      "h-11 text-sm font-medium border transition-all duration-200",
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : available
                        ? "border-neutral-300 hover:border-black"
                        : "border-neutral-200 text-neutral-300 cursor-not-allowed line-through"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {selectedSize && getStockForSize(selectedSize) <= 5 && getStockForSize(selectedSize) > 0 && (
              <p className="text-xs text-neutral-500">
                Only {getStockForSize(selectedSize)} left in stock
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-8">
            <form action={addProducttoShoppingCart} className="w-full">
              <button
                className="w-full h-12 bg-black text-white text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!selectedSize || !selectedColor || addingToBag}
                type="submit"
              >
                {addingToBag ? (
                  <BeatLoader size={8} color="#fff" />
                ) : (
                  "Add to Bag"
                )}
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isLoading}
                className="h-11 border border-black text-sm uppercase tracking-[0.1em] font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-40"
                onClick={() => handleBuyNow()}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mx-auto w-4 h-4" />
                ) : (
                  "Buy Now"
                )}
              </button>
              <button
                className="h-11 border border-neutral-300 text-sm uppercase tracking-[0.1em] font-medium hover:border-black transition-colors flex items-center justify-center gap-2"
                onClick={handleAddToWishlist}
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    isLiked && "fill-black text-black"
                  )}
                  strokeWidth={1.5}
                />
                {isLiked ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Features Strip */}
          <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-t border-b border-neutral-200">
            <div className="text-center">
              <Truck className="w-4 h-4 mx-auto mb-1.5" strokeWidth={1.5} />
              <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                Free Shipping
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-4 h-4 mx-auto mb-1.5" strokeWidth={1.5} />
              <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                Secure Payment
              </p>
            </div>
            <div className="text-center">
              <RefreshCw
                className="w-4 h-4 mx-auto mb-1.5"
                strokeWidth={1.5}
              />
              <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                Easy Returns
              </p>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="mt-6 space-y-0">
            {/* Description */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => toggleSection("description")}
                className="w-full flex items-center justify-between py-4"
              >
                <span className="text-xs uppercase tracking-[0.15em] font-medium">
                  Description
                </span>
                {expandedSection === "description" ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
              {expandedSection === "description" && (
                <div className="pb-4 text-sm text-neutral-600 leading-relaxed space-y-2">
                  {data.description.split("•").map((part, index) => (
                    <p key={index} className="break-words">
                      {index !== 0 && "• "}
                      {part.trim()}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="border-b border-neutral-200">
              <button
                onClick={() => toggleSection("specs")}
                className="w-full flex items-center justify-between py-4"
              >
                <span className="text-xs uppercase tracking-[0.15em] font-medium">
                  Specifications
                </span>
                {expandedSection === "specs" ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
              {expandedSection === "specs" && (
                <div className="pb-4 space-y-3">
                  {[
                    { label: "Material", value: data.material },
                    { label: "Pattern", value: data.pattern },
                    { label: "Fit Type", value: data.fitType },
                    { label: "Sleeve", value: data.sleeveType },
                    { label: "Collar", value: data.collarStyle },
                    {
                      label: "Country of Origin",
                      value: data.countryOfOrigin,
                    },
                    { label: "Manufacturer", value: data.manufacturer },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-neutral-400">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comfort Features */}
            {data.comfortFeatures.length > 0 && (
              <div className="border-b border-neutral-200">
                <button
                  onClick={() => toggleSection("comfort")}
                  className="w-full flex items-center justify-between py-4"
                >
                  <span className="text-xs uppercase tracking-[0.15em] font-medium">
                    Comfort Features
                  </span>
                  {expandedSection === "comfort" ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
                {expandedSection === "comfort" && (
                  <div className="pb-4 flex flex-wrap gap-2">
                    {data.comfortFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs uppercase tracking-wider border border-neutral-200 px-3 py-1.5"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-[0.15em] font-medium">
                Reviews ({data.reviews.length})
              </h3>
              <ReviewDialog
                productId={data.id}
                isOpen={isOpen}
                onClose={() => setIsOpen(!isOpen)}
              />
            </div>

            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <div key={review.id} className="border-b border-neutral-100 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={review.user.profileImage}
                          alt={`${review.user.firstName || "Anonymous"}'s profile`}
                        />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium">
                            {review.user.firstName || "Anonymous"}{" "}
                            {review.user.lastName || ""}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        className="text-neutral-400 hover:text-black transition-colors"
                        onClick={() => handleDeleteReview(review.id)}
                        aria-label="Delete review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {data.reviews.length > 3 && (
              <button
                className="w-full mt-4 py-2.5 border border-neutral-200 text-xs uppercase tracking-[0.15em] font-medium hover:border-black transition-colors"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "Show Less" : "View All Reviews"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
