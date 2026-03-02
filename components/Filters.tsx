import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import FilterOptions from "@/components/storefront/filter-options";
import { FilterFormValues } from "@/app/lib/zodSchemas";
import {
  SortOptionsComponent,
  type SortOption,
} from "@/components/storefront/sort-options";
import { Button } from "./ui/button";
import { Category } from "@prisma/client";
import { useFilterStore } from "@/lib/filterStore";

type Props = {
  fetchProducts: (
    filters?: FilterFormValues,
    sort?: SortOption
  ) => Promise<void>;
  category?: string;
  activeFilters: FilterFormValues | undefined;
  setActiveFilters: React.Dispatch<
    React.SetStateAction<FilterFormValues | undefined>
  >;
};

interface FiltersProps {
  category?: string;
}

const Filters = ({ category }: FiltersProps) => {
  const {
    filters,
    sortOption,
    isFilterOpen,
    setFilters,
    setSortOption,
    setIsFilterOpen,
    clearFilters
  } = useFilterStore();

  const handleSort = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  return (
    <div className="flex gap-4">
      {filters &&
        Object.keys(filters).some((key) => {
          const value = filters[key as keyof FilterFormValues];
          return Array.isArray(value) && value.length > 0;
        }) && (
          <Button
            variant="link"
            onClick={clearFilters}
            className="text-sm text-blue-600 pl-0"
          >
            Clear all filters
          </Button>
        )}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Filter</Button>
        </SheetTrigger>
        <SheetContent side="right" className="md:min-w-[700px] sm:w-[400px]">
          <FilterOptions
            onClose={() => setIsFilterOpen(false)}
            onSubmit={(data) => setFilters(data)}
            currentCategory={
              category
                ? (category.toUpperCase().replace(/-/g, "_") as Category)
                : undefined
            }
            initialValues={filters}
          />
        </SheetContent>
      </Sheet>
      <SortOptionsComponent 
        onSort={handleSort} 
        currentSort={sortOption} 
      />
    </div>
  );
};

export default Filters;
