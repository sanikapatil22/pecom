'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal } from 'lucide-react'

export interface FilterOptions {
  priceRange: [number, number]
  sizes: string[]
  categories: string[]
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular'

interface FilterModalProps {
  onFilterChange: (filters: FilterOptions) => void
  onSortChange: (sort: SortOption) => void
}

export function FilterModal({ onFilterChange, onSortChange }: FilterModalProps) {
  const [open, setOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const categories = ['T-Shirts', 'Hoodies', 'Jeans', 'Shirts', 'Jackets']

  const handleApply = () => {
    onFilterChange({
      priceRange,
      sizes: selectedSizes,
      categories: selectedCategories,
    })
    onSortChange(sortBy)
    setOpen(false)
  }

  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter & Sort
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Filter & Sort Products</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <Label className="text-base">Sort By</Label>
              <RadioGroup 
                value={sortBy} 
                onValueChange={(value: string) => setSortBy(value as SortOption)}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="newest"
                  className="flex items-center gap-2 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5"
                >
                  <RadioGroupItem value="newest" id="newest" />
                  Newest First
                </Label>
                <Label
                  htmlFor="popular"
                  className="flex items-center gap-2 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5"
                >
                  <RadioGroupItem value="popular" id="popular" />
                  Most Popular
                </Label>
                <Label
                  htmlFor="price-asc"
                  className="flex items-center gap-2 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5"
                >
                  <RadioGroupItem value="price-asc" id="price-asc" />
                  Price: Low to High
                </Label>
                <Label
                  htmlFor="price-desc"
                  className="flex items-center gap-2 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5"
                >
                  <RadioGroupItem value="price-desc" id="price-desc" />
                  Price: High to Low
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Price Range</Label>
              <div className="px-2">
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Size</Label>
              <div className="grid grid-cols-3 gap-4">
                {sizes.map((size) => (
                  <Label
                    key={size}
                    className="flex items-center gap-2 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5"
                  >
                    <Checkbox
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setSelectedSizes([...selectedSizes, size])
                        } else {
                          setSelectedSizes(selectedSizes.filter(s => s !== size))
                        }
                      }}
                    />
                    {size}
                  </Label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Categories</Label>
              <div className="grid gap-3">
                {categories.map((category) => (
                  <Label
                    key={category}
                    className="flex items-center gap-2 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category])
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category))
                        }
                      }}
                    />
                    {category}
                  </Label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


