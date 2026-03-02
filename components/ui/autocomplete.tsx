import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check, Star, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverAnchor, PopoverContent } from "./popover";
import { Skeleton } from "./skeleton";
import { Input } from "./input";
import { Prisma, Product } from "@prisma/client";

type AutoCompleteProps = {
  selectedValue: string;
  onSelectedValueChange: (value: string) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: Prisma.ProductGetPayload<{
    include: {
      reviews: true
    }
  }>[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
};

export function AutoComplete({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = "No products found.",
  placeholder = "Search products...",
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(product =>
      product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [items, searchValue]);

  const reset = () => {
    onSelectedValueChange("");
    onSearchValueChange("");
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !e.relatedTarget?.hasAttribute("cmdk-list")
    ) {
      reset();
    }
  };

  const onSelectItem = (productId: string) => {
    if (productId === selectedValue) {
      reset();
    } else {
      onSelectedValueChange(productId);
      const selectedProduct = items.find(p => p.id === productId);
      onSearchValueChange(selectedProduct?.name ?? "");
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center md:w-[500px] w-full shadow-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!searchValue || !open)}
              onFocus={() => setOpen(true)}
              onBlur={onInputBlur}
            >
              <Input
                placeholder={placeholder}
                className="border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
              />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            className="md:w-[500px] w-[100vw] mx-auto p-0 rounded-lg shadow-2xl border border-gray-100"
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
          >
            <CommandList className="max-h-[400px] overflow-y-auto">
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-2 space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {filteredItems.length > 0 && !isLoading ? (
                <CommandGroup>
                  {filteredItems.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={onSelectItem}
                      className="p-3 hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="md:w-40 md:h-40 w-24 h-24 flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow space-y-2">
                          <div>
                            <div className="font-bold md:text-xl text-sm text-gray-800">
                              {product.name}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm line-through text-gray-400 mr-2">
                                ₹{product.originalPrice}
                              </span>
                              <span className="font-bold text-green-600 md:text-lg text-sm">
                                ₹{product.finalPrice}
                              </span>
                            </div>
                          </div>
                          <div className="md:text-sm text-xs text-gray-600 line-clamp-2">
                            {product.description}
                          </div>
                          <div className="flex text-black">
                            {(() => {
                              const averageRating = product.reviews.length
                                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                                : 0;

                              return (
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < Math.floor(averageRating)
                                        ? 'fill-current text-black'
                                        : (i < averageRating ? 'fill-current text-black opacity-50' : 'stroke-current text-gray-300')
                                        }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    ({averageRating.toFixed(1)})
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "mr-2 h-6 w-6 text-green-500 bg-green-50 rounded-full p-1 transition-all duration-300",
                            selectedValue === product.id
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading && filteredItems.length === 0 ? (
                <CommandEmpty className="p-4 text-center text-gray-500">
                  {emptyMessage}
                </CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}

export default AutoComplete;
