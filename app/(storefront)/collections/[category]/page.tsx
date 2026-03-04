"use client";
import { Prisma } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getBanner, getProducts } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { useFilterStore } from "@/lib/filterStore";
import Filters from "@/components/Filters";
import { ProductCard } from "@/components/storefront/GenderTabs";

interface CategoryPageProps {
  params: {
    category?: string;
  };
}

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    reviews: true;
    variants: { select: { color: true } };
  };
}>;

export default function CategoriesPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filters, sortOption } = useFilterStore();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProducts(params.category || "all-products", filters, sortOption);
      setProducts(result.data as ProductWithVariants[]);
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
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-semibold text-3xl">{title}</h1>
          <Filters category={params.category} />
        </div>

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 justify-center">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  name: item.name,
                  images: item.images,
                  finalPrice: item.finalPrice,
                  originalPrice: item.originalPrice,
                  variants: item.variants,
                }}
              />
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
