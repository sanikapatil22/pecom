import { Color, Size } from "@prisma/client";
import { disconnect } from "process";
import { z } from "zod";

export const GenderEnum = z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]);

export const CategoryEnum = z.enum([
  "TANKS", "T_SHIRTS", "HOODIES", "SHORTS", "JEANS",
  "OUTERWEAR", "JOGGERS", "OVERSIZED_TSHIRTS", "ACCESSORIES", "ALL_PRODUCTS"
]);

export const SizeEnum = z.enum([
   "XS", "S", "M", "L", "XL", "XXL"
]);

export const ColorEnum = z.enum([
  "BLACK", "WHITE", "GRAY", "RED", "BLUE", "GREEN", "YELLOW",
  "PURPLE", "PINK", "ORANGE", "NAVY", "BROWN", "MULTICOLOR",
  "DUSTY_GREEN", "MAROON", "COOKIE", "BEIGE", "SKY_BLUE",
  "LIGHT_GREEN", "KHAKI"
]);

export const productVariantSchema = z.object({
  size: SizeEnum,
  color: ColorEnum,
  stock: z.number().min(0, "Stock cannot be negative"),
});

export const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  headline: z.string().min(5, { message: "Headline must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  material: z.string(),
  pattern: z.string(),
  fitType: z.string(),
  sleeveType: z.string(),
  collarStyle: z.string(),
  length: z.string(),
  countryOfOrigin: z.string(),
  comfortFeatures: z.array(z.string()),
  manufacturer: z.string(),
  packer: z.string(),
  // itemWeight: z.number().optional(),
  netQuantity: z.number().int().positive().optional().default(20),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  originalPrice: z.number().int().positive(),
  finalPrice: z.number().int().positive(),
  gender: z.enum(["MEN", "WOMEN", "KIDS", "UNISEX"]),
  category: z.enum([
    "TANKS", "T_SHIRTS", "HOODIES", "SHORTS", "JEANS", "OUTERWEAR",
    "JOGGERS", "OVERSIZED_TSHIRTS", "ACCESSORIES", "ALL_PRODUCTS"
  ]),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean().nullable(),
  variants: z.array(z.object({
    size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
    color: z.enum([
      "BLACK", "WHITE", "GRAY", "RED", "BLUE", "GREEN", "YELLOW",
      "PURPLE", "PINK", "ORANGE", "NAVY", "BROWN", "MULTICOLOR",
      "DUSTY_GREEN", "MAROON", "COOKIE", "BEIGE", "SKY_BLUE",
      "LIGHT_GREEN", "KHAKI"
    ]),
    stock: z.number().int().nonnegative(),
  })),
  images: z.array(z.string()).min(1, { message: "At least one image is required" }),
  sku: z.string().min(1, { message: "Item weight is required" }).optional(),
})


export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageString: z.string().min(1, "Image is required"),
  category: z.enum([
    "TANKS", "T_SHIRTS", "HOODIES", "SHORTS", "JEANS", "OUTERWEAR",
    "JOGGERS", "OVERSIZED_TSHIRTS", "ACCESSORIES", "ALL_PRODUCTS"
  ]),
});

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
});

export const orderSchema = z.object({
  userId: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).default("PENDING"),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  amount: z.number().min(0, "Total amount cannot be negative"),
});

export type Product = z.infer<typeof productSchema>;
export type Banner = z.infer<typeof bannerSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;

export interface ProductType {
  id: string;
  name: string;
  description: string;
  headline: string;
  material: string;
  pattern: string;
  fitType: string;
  sleeveType: string;
  collarStyle: string;
  length: string;
  countryOfOrigin: string;
  manufacturer: string;
  packer: string;
  netQuantity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  originalPrice: number;
  finalPrice: number;
  images: string[];
  gender: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
  category: 'TANKS' | 'T_SHIRTS' | 'HOODIES' | 'SHORTS' | 'JEANS' | 'OUTERWEAR' | 'JOGGERS' | 'OVERSIZED_TSHIRTS' | 'ACCESSORIES' | 'ALL_PRODUCTS';
  isFeatured: boolean;
  isBestSeller: boolean | null;
  comfortFeatures: string[];
  sku: string | undefined;
  variants: {
    id: string;
    color: Color;
    size: Size;
    stock: number;
  }[];
}


export const filterFormSchema = z.object({
  categories: z.array(z.enum([
    "TANKS", "T_SHIRTS", "OVERSIZED_TSHIRTS", "SHORTS", "JEANS",
    "OUTERWEAR", "JOGGERS", "HOODIES", "ACCESSORIES", "ALL_PRODUCTS"
  ])).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  priceRange: z.array(z.number()).optional(),
  rating: z.number().optional(),
})

export type FilterFormValues = z.infer<typeof filterFormSchema>


export const EditHomeContentSchema = z.object({
  headingLarge: z.string().optional(),
  headingSmall: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  cardTitle: z.string().optional(),
  cardDescription: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type EditHomeContentValues = z.infer<typeof EditHomeContentSchema>

export const couponCodeSchema = z.object({
  code: z.string(),
  discount: z.number(),
  isValid: z.boolean(),
})

export type CouponCodeValue = z.infer<typeof couponCodeSchema>
