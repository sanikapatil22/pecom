'use client'
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define sort options as string literals to ensure type safety
export const SortOptions = {
  ALL : 'all',
  FEATURED: 'featured',
  PRICE_LOW_TO_HIGH: 'price-low-to-high',
  PRICE_HIGH_TO_LOW: 'price-high-to-low',
  NEWEST: 'newest',
  RATING: 'rating',
} as const;

// Update the SortOption type to match exactly what's in your Zustand store
export type SortOption = (typeof SortOptions)[keyof typeof SortOptions];

interface SortOptionsProps {
  onSort: (value: SortOption) => void;
  currentSort: SortOption;
}

export function SortOptionsComponent({ onSort, currentSort }: SortOptionsProps) {
  // Create a mapping for display names
  const sortDisplayNames: Record<SortOption, string> = {
    [SortOptions.ALL] : 'All',
    [SortOptions.FEATURED]: 'Featured',
    [SortOptions.PRICE_LOW_TO_HIGH]: 'Price: Low to High',
    [SortOptions.PRICE_HIGH_TO_LOW]: 'Price: High to Low',
    [SortOptions.NEWEST]: 'Newest Arrivals',
    [SortOptions.RATING]: 'Highest Rated',
  };

  return (
    <Select
      value={currentSort}
      onValueChange={(value: SortOption) => onSort(value)}
    >
      <SelectTrigger className="md:w-[180px]">
        <SelectValue>
          {sortDisplayNames[currentSort] || 'Sort by'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SortOptions).map(([key, value]) => (
          <SelectItem key={value} value={value}>
            {sortDisplayNames[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
