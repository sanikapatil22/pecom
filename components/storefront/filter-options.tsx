import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { filterFormSchema, FilterFormValues } from "@/app/lib/zodSchemas";
import { Category } from "@prisma/client";

const categories = [
  "TANKS",
  "T_SHIRTS",
  "OVERSIZED_TSHIRTS",
  "SHORTS",
  "JEANS",
  "OUTERWEAR",
  "JOGGERS",
  "HOODIES",
  "ACCESSORIES",
  "ALL_PRODUCTS",
] as const;

const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow"] as const;
const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
  { label: "₹1500 - ₹2000", min: 1500, max: 2000 },
  { label: "Above ₹2000", min: 2000, max: Infinity },
] as const;

interface FilterOptionsProps {
  onClose: () => void;
  onSubmit: (data: FilterFormValues) => void;
  currentCategory?: Category;
  initialValues?: FilterFormValues;
}

export function FilterOptions({ onClose, onSubmit, initialValues }: FilterOptionsProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      categories: initialValues?.categories || [],
      sizes: initialValues?.sizes || [],
      colors: initialValues?.colors || [],
      priceRange: initialValues?.priceRange || [],
    },
  });

  const handleSubmit = (data: FilterFormValues) => {
    const updatedData = {
      ...data,
      categories: data.categories || []
    };

    // If ALL_PRODUCTS is selected, clear other categories
    if (updatedData.categories.includes("ALL_PRODUCTS")) {
      updatedData.categories = ["ALL_PRODUCTS"];
    }

    onSubmit?.(updatedData);
    onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h2 className="text-xl font-semibold">Filters</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-6">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => {
                        const isChecked = field.value?.includes(category);
                        const isDisabled = category !== "ALL_PRODUCTS" &&
                          field.value?.includes("ALL_PRODUCTS");

                        return (
                          <FormItem key={category} className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={isChecked}
                                disabled={isDisabled}
                                onCheckedChange={(checked) => {
                                  let updatedValue = field.value || [];

                                  if (category === "ALL_PRODUCTS" && checked) {
                                    updatedValue = ["ALL_PRODUCTS"];
                                  } else if (checked) {
                                    updatedValue = updatedValue
                                      .filter(cat => cat !== "ALL_PRODUCTS")
                                      //@ts-ignore
                                      .concat(category);
                                  } else {
                                    updatedValue = updatedValue
                                      .filter(cat => cat !== category);
                                  }

                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <Label className="text-sm">
                              {category.replace(/_/g, " ")}
                            </Label>
                          </FormItem>
                        );
                      })}
                    </div>
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-medium mb-3">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant={field.value?.includes(size) ? "default" : "outline"}
                          className="h-8 px-3"
                          onClick={() => {
                            const currentValue = field.value || [];
                            const updatedValue = currentValue.includes(size)
                              ? currentValue.filter((s) => s !== size)
                              : [...currentValue, size];
                            field.onChange(updatedValue);
                          }}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-medium mb-3">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <Button
                          key={color}
                          type="button"
                          variant={field.value?.includes(color) ? "default" : "outline"}
                          className="h-8 px-3"
                          onClick={() => {
                            const currentValue = field.value || [];
                            const updatedValue = currentValue.includes(color)
                              ? currentValue.filter((c) => c !== color)
                              : [...currentValue, color];
                            field.onChange(updatedValue);
                          }}
                        >
                          <div
                            className="w-3 h-3 rounded-full mr-1.5"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          {color}
                        </Button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {priceRanges.map((range) => (
                        <Button
                          key={range.label}
                          type="button"
                          variant={
                            field.value?.[0] === range.min &&
                              field.value?.[1] === range.max
                              ? "default"
                              : "outline"
                          }
                          className="h-8"
                          onClick={() => field.onChange([range.min, range.max])}
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>

          <div className="p-4 border-t mt-auto shrink-0 bg-white">
            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default FilterOptions;
