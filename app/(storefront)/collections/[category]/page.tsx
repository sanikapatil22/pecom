"use client";
import { Banner, Prisma } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { HeroCarousel } from "@/components/hero-carousal";
import { ProductCard1 } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { getBanner, getProducts } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { useFilterStore } from "@/lib/filterStore";
import Filters from "@/components/Filters";

interface CategoryPageProps {
  params: {
    category?: string;
  };
}

type ProductWithReviews = Prisma.ProductGetPayload<{
  include: {
    reviews: true;
  };
}>;

export default function CategoriesPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<ProductWithReviews[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filters, sortOption } = useFilterStore();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const [result] = await Promise.all([
        getProducts(params.category || "all-products", filters, sortOption),
        getBanner(params.category || "all-products")
      ]);

      setProducts(result.data);
      setTitle(result.title);
      setError(null);
    } catch (err) {
      setError("Error loading products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.category, filters, sortOption]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchProducts()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1550x] mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-semibold text-3xl">{title}</h1>
          </div>
          <Filters category={params.category} />
        </div>

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <ProductCard1
                  id={item.id}
                  title={item.name}
                  price={item.finalPrice}
                  tagline={item.headline}
                  originalPrice={item.originalPrice}
                  rating={
                    item.reviews.length > 0
                      ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
                      : 0 // Default rating if there are no reviews
                  }
                  reviews={item.reviews.length}
                  imageUrl={item.images}
                  isBestSeller={item.isBestSeller}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
