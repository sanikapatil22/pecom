"use client";

import { useState } from "react";
import {
  FilterModal,
  FilterOptions,
  SortOption,
} from "@/components/filter-modal";
import { ProductCard1 } from "@/components/storefront/product-card";
import { Prisma } from "@prisma/client";

type ProductWithReviews = Prisma.ProductGetPayload<{
  include: {
    reviews: true;
  };
}>;

interface CategoryPageProps {
  initialData: ProductWithReviews[];
  title: string;
}

export function CategoryPageClient({ initialData, title }: CategoryPageProps) {
  const [filteredData, setFilteredData] = useState<ProductWithReviews[]>(initialData);

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...initialData];

    filtered = filtered.filter(
      (product) =>
        product.finalPrice >= filters.priceRange[0] &&
        product.finalPrice <= filters.priceRange[1]
    );

    setFilteredData(filtered);
  };

  const handleSortChange = (sort: SortOption) => {
    let sorted = [...filteredData];

    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
    }

    setFilteredData(sorted);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8">
      <div className="flex justify-between items-center mb-8 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-medium uppercase tracking-[0.1em]">{title}</h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
            {filteredData.length} {filteredData.length === 1 ? "product" : "products"}
          </p>
        </div>
        <FilterModal
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {filteredData.map((item) => (
          <ProductCard1
            key={item.id}
            id={item.id}
            title={item.name}
            tagline={item.headline}
            description={item.description}
            price={item.finalPrice}
            originalPrice={item.originalPrice}
            rating={
              item.reviews.length > 0
                ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
                : 0
            }
            reviews={item.reviews.length}
            imageUrl={item.images}
            isBestSeller={item.isBestSeller}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm uppercase tracking-[0.15em] text-neutral-400">
            No products found
          </p>
        </div>
      )}
    </div>
  );
}
