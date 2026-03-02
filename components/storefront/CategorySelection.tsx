"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Product, Category } from "@prisma/client";

interface FeaturedProduct {
  category: Category;
  product: Product;
}

interface CategoryData {
  id: string;
  type: "hero" | "product" | "banner";
  title?: string;
  subtitle?: string;
  product?: Product;
  category?: Category;
  bannerData?: {
    title: string;
    subtitle: string;
    image: string;
    link: string;
  };
  gridArea?: string;
}

interface CategoriesSectionProps {
  featuredProducts: FeaturedProduct[];
}

const getCategoryUrl = (category: Category): string => {
  return category.toString().toLowerCase().replace(/_/g, "-");
};

const formatCategoryName = (category: Category): string => {
  return category
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CategoriesSection = ({ featuredProducts }: CategoriesSectionProps) => {
  const getFeaturedProduct = (
    categories: Category[]
  ): FeaturedProduct | undefined => {
    return featuredProducts.find((fp) => categories.includes(fp.category));
  };

  const tShirtProduct = getFeaturedProduct([Category.T_SHIRTS]);
  const outerWearProduct = getFeaturedProduct([Category.OUTERWEAR]);
  const hoodiesProduct = getFeaturedProduct([Category.HOODIES]);
  const oversizedTShirtsProduct = getFeaturedProduct([Category.OVERSIZED_TSHIRTS]);
  const joggersProduct = getFeaturedProduct([Category.JOGGERS]);
  const tanksProduct = getFeaturedProduct([Category.TANKS]);

  const categoryItems: CategoryData[] = [
    {
      id: "hero",
      type: "banner",
      gridArea: "hero",
      bannerData: {
        title: "Summer Collection",
        subtitle: "Discover our latest arrivals",
        image: tShirtProduct?.product.images[0] ?? "/women.jpeg",
        link: "/collections/t-shirts",
      },
    },
    {
      id: "featured-1",
      type: "banner",
      gridArea: "square1",
      bannerData: {
        title: formatCategoryName(Category.TANKS),
        subtitle: "Discover our latest arrivals",
        image: tanksProduct?.product.images[0] ?? "/men.jpeg",
        link: `/collections/${getCategoryUrl(Category.TANKS)}`,
      },
    },
    {
      id: "featured-2",
      type: "banner",
      gridArea: "square2",
      bannerData: {
        title: "Polo T-Shirt",
        image: outerWearProduct?.product.images[0] ?? "/Regular-Polo.jpg",
        link: `/collections/${getCategoryUrl(Category.OUTERWEAR)}`,
        subtitle: "Handcrafted with the finest materials",
      }
    },
    {
      id: "main-banner",
      type: "banner",
      gridArea: "main",
      bannerData: {
        title: "T-Shirts",
        subtitle: "Exclusive collections",
        image: oversizedTShirtsProduct?.product.images[0] ?? "/women.jpeg",
        link: `/collections/${getCategoryUrl(Category.OVERSIZED_TSHIRTS)}`,
      },
    },
    {
      id: "right-top",
      type: "banner",
      gridArea: "right1",
      bannerData: {
        title: "New Season",
        subtitle: "Discover the latest trends",
        image: "/all-products.webp",
        link: `/collections/${getCategoryUrl(Category.ALL_PRODUCTS)}`,
      },
    },
    {
      id: "right-bottom",
      type: "banner",
      gridArea: "right2",
      bannerData: {
        title: "Hoodies",
        subtitle: "Complete your look with our premium hoodies",
        image: hoodiesProduct?.product.images[0] ?? "/all.jpeg",
        link: `/collections/${getCategoryUrl(Category.HOODIES)}`,
      },
    },
    {
      id: "bottom-banner",
      type: "banner",
      gridArea: "bottom",
      bannerData: {
        title: formatCategoryName(Category.JOGGERS),
        subtitle: "Get early access to new drops",
        image: joggersProduct?.product.images[0] ?? "/all.jpeg",
        link: `/collections/${getCategoryUrl(Category.JOGGERS)}`,
      },
    },
  ];

  const renderCard = (item: CategoryData, index: number) => (
    <Card
      key={item.id}
      className={`overflow-hidden rounded-2xl bg-zinc-900 ${item.gridArea}`}
    >
      <motion.div
        className="relative h-full w-full group"
        initial={{ opacity: 0.95 }} // Start with slight opacity
        animate={{ opacity: 1 }} // Always animate to full opacity
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {item.type === "product" && item.product && (
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              className="transition-transform duration-300 group-hover:scale-105 object-cover"
              fill
              priority={index < 3}
            />
          )}
          {item.type === "banner" && item.bannerData && (
            <Image
              src={item.bannerData.image}
              alt={item.bannerData.title}
              className="transition-transform duration-300 group-hover:scale-105 object-cover"
              fill
              priority={index < 3}
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <CardContent className="relative h-full p-4 md:p-6 flex flex-col justify-end">
          {item.type === "product" && item.product && item.category && (
            <>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white">
                {item.product.name}
              </h3>
              <p className="text-base md:text-lg font-medium text-white">
                ₹{(item.product.finalPrice).toFixed()}
              </p>
              <Button
                variant="outline"
                className="mt-4 w-fit transition-colors group text-sm md:text-base"
              >
                View Product
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </>
          )}
          {item.type === "banner" && item.bannerData && (
            <>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-white">
                {item.bannerData.title}
              </h3>
              <p className="text-sm md:text-base text-gray-200 mb-4">
                {item.bannerData.subtitle}
              </p>
              <Button
                variant="outline"
                className="w-fit border-white hover:bg-white hover:text-black transition-colors group text-sm md:text-base"
              >
                Explore
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </>
          )}
        </CardContent>

        {/* Link overlay */}
        <Link
          href={
            item.type === "product" && item.product
              ? `/product/${item.product.id}`
              : item.bannerData?.link || "#"
          }
          className="absolute inset-0"
        >
          <span className="sr-only">
            {item.type === "product" ? "View product" : "View collection"}
          </span>
        </Link>
      </motion.div>
    </Card>
  );

  return (
    <section className="py-8 md:py-12 px-4 md:px-0 max-w-[1550px] mx-auto mt-4 md:mt-6">
      {/* <PromotionalBanner /> */}

      {/* Main Grid */}
      <div className="grid gap-4 mt-6 md:mt-8 categories-grid">
        {categoryItems.map((item, index) => renderCard(item, index))}
      </div>

      {/* Add this style tag in your layout or global CSS file */}
      <style jsx global>{`
        .categories-grid {
          display: grid;
          gap: 1rem;
        }

        .categories-grid > div {
          min-height: 300px;
        }

        /* Mobile layout - stack all items */
        @media (max-width: 767px) {
          .categories-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "hero"
              "square1"
              "square2"
              "main"
              "right1"
              "right2"
              "bottom";
          }
        }

        /* Tablet layout */
        @media (min-width: 768px) and (max-width: 1023px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-areas:
              "hero hero"
              "square1 square2"
              "main main"
              "right1 right2"
              "bottom bottom";
          }

          .main {
            min-height: 400px;
          }
        }

        /* Desktop layout */
        @media (min-width: 1024px) {
          .categories-grid {
            min-height: 1000px;
            grid-template-columns:
              minmax(250px, 1fr) minmax(300px, 2fr) minmax(300px, 2fr)
              minmax(250px, 1fr);
            grid-template-rows: auto 1fr 1fr auto;
            grid-template-areas:
              "hero    hero    hero    hero"
              "square1 main    main    right1"
              "square2 main    main    right1"
              "square2 bottom  bottom  right2";
          }
        }

        /* Grid area classes */
        .hero {
          grid-area: hero;
        }
        .square1 {
          grid-area: square1;
        }
        .square2 {
          grid-area: square2;
        }
        .main {
          grid-area: main;
        }
        .right1 {
          grid-area: right1;
        }
        .right2 {
          grid-area: right2;
        }
        .bottom {
          grid-area: bottom;
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;
