"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { getFeaturedProducts } from "@/app/actions";
import Link from "next/link";

// Type definitions
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

const AnimatedProductCard = ({ item }: { item: Product }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);
  const [isHovered, setIsHovered] = useState(false);
  const discount = Math.round(((item.originalPrice - item.finalPrice) / item.originalPrice) * 100);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-72 h-96 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      style={{ transformOrigin: "center center" }}
    >
      <div className="relative h-56 w-full">
        <Image
          src={item.images[0]}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <motion.div
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 flex items-center shadow-md"
          animate={isHovered ? { scale: 1.1 } : {}}
          transition={{ duration: 0.3 }}
        >
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-xs font-medium ml-1">
            {item.variants.length} variants
          </span>
        </motion.div>
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white text-sm px-3 py-1 rounded-md z-10 font-medium">
            {discount}% OFF
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <motion.div
        className="p-6 relative"
        animate={
          isHovered
            ? { backgroundColor: "#f8fafc" }
            : { backgroundColor: "#ffffff" }
        }
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(item.finalPrice)}
            </span>
            {discount > 0 && (
              <span className="text-gray-500 line-through text-sm">
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">{item.description.slice(0, 100)}...</p>
      </motion.div>
    </motion.div>
  );
};

// LoadingProductCard Component
const LoadingProductCard = () => {
  return (
    <div className="w-72 h-96 bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-64 bg-gray-300" />
      <div className="p-6 h-32">
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-gray-300 rounded w-2/3" />
          <div className="h-6 bg-gray-300 rounded w-1/4" />
        </div>
        <div className="h-4 bg-gray-300 rounded w-full mt-4" />
        <div className="h-4 bg-gray-300 rounded w-3/4 mt-2" />
      </div>
    </div>
  );
};

// Infinite Scrolling Container Component
const InfiniteScrollContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className="flex overflow-x-auto py-8 w-full gap-8 px-4 scrollbar-hide overflow-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {children}
    </div>
  );
};

// Main Featured Products Component
export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-0">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Featured Products
          </h2>
          <InfiniteScrollContainer>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 mx-4">
                <LoadingProductCard />
              </div>
            ))}
          </InfiniteScrollContainer>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 lg:px-0">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Featured Products
        </h2>
        <InfiniteScrollContainer>
          {products.map((item) => (
            <div key={item.id} className="flex-shrink-0 mx-4">
              <Link href={`/product/${item.id}`}>
                <AnimatedProductCard item={item} />
              </Link>
            </div>
          ))}
        </InfiniteScrollContainer>
      </div>
    </section>
  );
}

export default FeaturedProducts;
