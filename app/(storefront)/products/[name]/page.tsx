import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { Gender } from "@prisma/client";
import { HeroCarousel } from "@/components/hero-carousal";
import { ProductCard1 } from "@/components/storefront/product-card";
import { getBanner } from "@/app/actions";

async function getData(productCategory: string) {
  const gender = productCategory.toUpperCase() as Gender;

  switch (productCategory) {
    case "new": {
      // Get products added in the last 30 days
      const data = await prisma.product.findMany({
        where: {
          status: "PUBLISHED",
        },
        select: {
          name: true,
          images: true,
          originalPrice: true,
          headline: true,
          finalPrice: true,
          id: true,
          reviews: true,
          description: true,
          variants: {
            select: {
              color: true,
            },
          },
          createdAt: true, // Added to sort by creation date
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 12, // Limit to the 12 most recent products
      });

      return {
        title: "New Arrivals",
        data,
      };
    }
    case "all": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          headline: true,
          originalPrice: true,
          reviews: true,
          finalPrice: true,
          id: true,
          variants: {
            select: {
              color: true,
            },
          },
        },
        where: {
          status: "PUBLISHED",
        },
      });
      return {
        title: "All Products",
        data,
      };
    }
    case productCategory: {
      const data = await prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          gender: gender,
        },
        select: {
          name: true,
          images: true,
          originalPrice: true,
          finalPrice: true,
          headline: true,
          id: true,
          reviews: true,
          description: true,
          variants: {
            select: {
              color: true,
            },
          },
        },
      });
      return {
        title: `Products for ${productCategory}`,
        data,
      };
    }
    default: {
      return notFound();
    }
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  noStore();
  const { data, title } = await getData(params.name);
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 py-8">
        {data.length > 0 && (
          <>
            <h1 className="font-semibold text-3xl mb-8">{title}</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <ProductCard1
                    id={item.id}
                    title={item.name}
                    price={item.finalPrice}
                    originalPrice={item.originalPrice}
                    tagline={item.headline}
                    rating={
                      item.reviews.length > 0
                        ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
                        : 0 // Default rating if there are no reviews
                    }
                    reviews={item.reviews.length}
                    imageUrl={item.images}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
