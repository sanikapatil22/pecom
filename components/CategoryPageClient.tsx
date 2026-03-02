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

// Client component wrapper
export function CategoryPageClient({ initialData, title }: CategoryPageProps) {
  const [filteredData, setFilteredData] = useState<ProductWithReviews[]>(initialData);

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...initialData];

    // Apply price filter
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
      // Add logic for 'newest' and 'popular' if you have those fields
    }

    setFilteredData(sorted);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <FilterModal
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                : 0 // Default rating if there are no reviews
            }
            reviews={item.reviews.length}
            imageUrl={item.images}
            isBestSeller={item.isBestSeller}
          />
        ))}
      </div>
    </div>
  );
}
