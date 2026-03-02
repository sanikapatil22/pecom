import { create } from 'zustand';
import { FilterFormValues } from "@/app/lib/zodSchemas";
import { SortOption, SortOptions } from "@/components/storefront/sort-options";
import { Category } from "@prisma/client";

interface FilterState {
  filters: FilterFormValues | undefined;
  sortOption: SortOption;
  isFilterOpen: boolean;
  setFilters: (filters: FilterFormValues | undefined) => void;
  setSortOption: (sort: SortOption) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: undefined,
  sortOption: SortOptions.ALL,
  isFilterOpen: false,
  setFilters: (filters) => set({ filters }),
  setSortOption: (sortOption) => {
    set({ sortOption });
  },
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  clearFilters: () => set({ filters: undefined })
}));
