"use client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
import { ToastAction } from "@/components/ui/toast"
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
  KHAKI: "#F0E68C"
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

  // Add these helper functions after the existing ones (around line 124)

  const getAvailableColorsForSize = (size: Size): Color[] => {
    return data.variants
      .filter((variant) => variant.size === size && variant.stock > 0)
      .map((variant) => variant.color);
  };

  const uniqueColors = Array.from(new Set(data.variants.map(variant => variant.color)));


  const isColorAvailableForSize = (color: Color, size: Size): boolean => {
    return data.variants.some(
      (variant) =>
        variant.color === color && variant.size === size && variant.stock > 0
    );
  };

  // Update the size selection click handler
  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size);

    // If current color is not available for this size, find the first available color
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
        action: <ToastAction altText="Login"><Link href="/api/auth/login">Login</Link></ToastAction>
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
      router.push("/checkout")
      setIsLoading(false);
    }
  }

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
          action: <ToastAction altText="Login"><Link href="/api/auth/login">Login</Link></ToastAction>
        });
        return;
      };

      const result = await addItem(data.id, selectedSize, selectedColor);

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Oops",
          description: "Failed to add item to cart. Please try again.",
        });
      } else {
        toast({
          title: "Amazing 🎉",
          description: "Item successfully added to your cart",
        });
      }
    });
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Oops",
        description: "Please login to add item to favorites.",
        action: <ToastAction altText="Login"><Link href="/api/auth/login">Login</Link></ToastAction>
      });
      return;
    };
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

  return (
    <div className="container mx-auto px-4 my-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thumbnail Navigation */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="flex flex-col gap-4 sticky top-24">
            {data.images.map((image, index) => (
              <div key={index} className="relative w-20 h-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={image}
                    alt={`${data.name} view ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </motion.button>
                {currentImageIndex === index && (
                  <motion.div
                    layoutId="thumbnail-border"
                    className="absolute -inset-[2px] rounded-lg border-2 border-black"
                    initial={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Image */}
        <div className="lg:col-span-6 relative">
          <div className="relative h-[600px] w-full lg:sticky lg:top-24">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-full"
              >
                <Image
                  src={data.images[currentImageIndex]}
                  alt={data.name}
                  fill
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all active:scale-95 duration-200 border border-gray-400/80"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all active:scale-95 duration-200 border border-gray-400/80"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {data.images.length}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {data.isBestSeller === true ? (
              <Badge className="mb-4">
                {data.isBestSeller === true ? "BEST SELLER" : ""}
              </Badge>
            ) : null}
            <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
            <p className="text-gray-600">{data.headline}</p>
          </motion.div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">
                {formatPrice(data.finalPrice)}
              </span>
              <span className="text-2xl font-bold line-through text-gray-500">
                {formatPrice(data.originalPrice)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Inclusive of all taxes
              <br />
              (Also includes all applicable duties)
            </p>
          </div>

          {/* Color Display */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Color</h3>
              {selectedColor && (
                <span className="text-sm text-gray-500">
                  Selected: {selectedColor}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {Array.from(new Set(data.variants.map(variant => variant.color))).map((color, index) => {
                const isAvailable = selectedSize
                  ? isColorAvailableForSize(color, selectedSize)
                  : data.variants.some(v => v.color === color && v.stock > 0);

                return (
                  <TooltipProvider key={index}>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedColor(color)}
                          disabled={!isAvailable}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all duration-200",
                            selectedColor === color
                              ? "ring-2 ring-black ring-offset-2"
                              : "hover:scale-110",
                            !isAvailable && "opacity-30 cursor-not-allowed hover:scale-100",
                            // Add border for light colors
                            ["WHITE", "BEIGE", "LIGHT_GREEN", "SKY_BLUE", "KHAKI"].includes(color) && "border-gray-200"
                          )}
                          style={{
                            background: color === "MULTICOLOR"
                              ? colorMap[color]
                              : colorMap[color] || color.toLowerCase(),
                            borderColor: ["WHITE", "BEIGE", "LIGHT_GREEN", "SKY_BLUE", "KHAKI"].includes(color)
                              ? "#e5e5e5"
                              : colorMap[color] || color.toLowerCase(),
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white px-3 py-1.5 text-sm border shadow-sm">
                        <p>
                          {color}
                          {!isAvailable && " (Not available in this size)"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <h3 className="font-medium">Select Size</h3>
              <SizeChartDialog type={data.category} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ALL_SIZES.map((size) => {
                const stock = getStockForSize(size);
                return (
                  <Button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    disabled={!isSizeAvailable(size)}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={cn(
                      "w-full h-14 relative active:scale-95 transition-all duration-200",
                      !isSizeAvailable(size) && "opacity-50"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-sm font-medium">{size}</span>
                      {stock < 10 && stock > 5 && (<span className="text-xs text-yellow-500">
                        {stock === 0 ? "Out of stock" : `${stock} left`}
                      </span>)}
                      {stock <= 5 && stock > 0 && (<span className="text-xs text-orange-500">
                        {stock === 0 ? "Out of stock" : `Only ${stock} left`}
                      </span>)}
                      {stock === 0 && (<span className="text-xs text-gray-500">
                        {stock === 0 ? "Out of stock" : `${stock} left`}
                      </span>)}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}

          <div className="space-y-4">
            <Button
              disabled={isLoading}
              className="w-full h-12 border-2"
              onClick={() => handleBuyNow()}
            >
              {isLoading && (<Loader2 className="animate-spin mr-2" />)}
              Buy Now
            </Button>

            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                className="w-[50%] h-12 border-2"
                onClick={handleAddToWishlist}
              >
                <Heart
                  className={cn(
                    "mr-2 h-5 w-5 transition-colors",
                    isLiked && "fill-red-500 text-red-500"
                  )}
                />
                {isLiked ? "Added to Favorites" : "Add to Favorites"}
              </Button>
              <form
                className="w-[50%]"
                action={addProducttoShoppingCart}>
                <Button
                  className="w-full bg-black text-white hover:bg-black/90 h-12 text-lg active:scale-95 transition-all duration-200"
                  disabled={!selectedSize || !selectedColor || addingToBag}
                  type="submit"
                >
                  {addingToBag ? (
                    <BeatLoader size={10} color="#fff" />
                  ) : (
                    "Add to Bag"
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Free Shipping</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Secure Payment</p>
            </div>
            <div className="text-center">
              <RefreshCw className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Easy Returns</p>
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t">
            {/* Description */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Product Description</h3>
              <div className="text-gray-600 leading-relaxed space-y-2">
                {data.description.split('•').map((part, index) => (
                  <p key={index} className="whitespace-normal break-words max-w-full overflow-hidden">
                    {index !== 0 && '•'}{part.trim()}
                  </p>
                ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Specifications */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium">Specifications</h4>
                <dl className="space-y-4">
                  {[
                    { label: "Material", value: data.material },
                    { label: "Pattern", value: data.pattern },
                    { label: "Fit Type", value: data.fitType },
                    { label: "Sleeve", value: data.sleeveType },
                    { label: "Collar", value: data.collarStyle },
                  ].map(({ label, value }) => (
                    <div key={label} className="border-b pb-3">
                      <dt className="text-sm text-gray-500 mb-1">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium">Additional Info</h4>
                <dl className="space-y-4">
                  {[
                    { label: "Country of Origin", value: data.countryOfOrigin },
                    { label: "Manufacturer", value: data.manufacturer },
                  ].map(({ label, value }) => (
                    <div key={label} className="border-b pb-3">
                      <dt className="text-sm text-gray-500 mb-1">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Comfort Features */}
            {data.comfortFeatures.length > 0 && (
              <div className="pt-6">
                <h4 className="text-lg font-medium mb-4">Comfort Features</h4>
                <div className="flex flex-wrap gap-3">
                  {data.comfortFeatures.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-4 py-2 text-sm bg-gray-50"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}


            <ReviewDialog
              productId={data.id}
              isOpen={isOpen}
              onClose={() => setIsOpen(!isOpen)}
            />

            {/* Reviews Section */}
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={review.user.profileImage}
                          alt={`${review.user.firstName || "Anonymous"
                            }'s profile`}
                        />
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium">
                            {review.user.firstName || "Anonymous"}{" "}
                            {review.user.lastName || ""}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{review.comment}</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 ml-2"
                        onClick={() => handleDeleteReview(review.id)}
                        aria-label="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {data.reviews.length > 3 && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "Show Less" : "Show All Reviews"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
