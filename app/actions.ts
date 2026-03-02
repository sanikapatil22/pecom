"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import prisma from "./lib/db";
import { redis } from "./lib/redis";
import { Cart } from "./lib/interfaces";
import { revalidatePath } from "next/cache";
import { stripe } from "./lib/stripe";
import Stripe from "stripe";
import {
  productSchema,
  bannerSchema,
  FilterFormValues,
  EditHomeContentValues,
  CouponCodeValue,
} from "./lib/zodSchemas";
import { z } from "zod";
import { $Enums, Category, Color, OrderStatus, Prisma, Size } from "@prisma/client";
import { SortOption, SortOptions } from "../components/storefront/sort-options";
import { disconnect } from "process";

export const removeProductVariant = async (productId: string, variantId: string) => {
  try {
    // First nullify the variantId in all related OrderItems
    await prisma.orderItem.updateMany({
      where: { variantId: variantId },
      data: { variantId: null }
    });

    // Now we can safely delete the variant
    await prisma.productVariant.delete({
      where: { id: variantId }
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error removing product variant:", error);
    return { error: "Failed to remove variant" };
  }
};

export async function changeOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return { error: "User not authenticated" };
    }
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error changing order status:", error);
    return { error: "Failed to change order status" };
  }
}

// Add this new component
export async function updateTrackingId(orderId: string, trackingId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { trackingId },
  });
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Parse the ADMIN_EMAILS environment variable into an array
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  // Check if the user's email is in the list of admin emails
  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  try {
    const validatedData = productSchema.parse(data);

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        headline: validatedData.headline,
        material: validatedData.material,
        pattern: validatedData.pattern,
        fitType: validatedData.fitType,
        sleeveType: validatedData.sleeveType,
        collarStyle: validatedData.collarStyle,
        length: validatedData.length,
        countryOfOrigin: validatedData.countryOfOrigin,
        manufacturer: validatedData.manufacturer,
        packer: validatedData.packer,
        sku: validatedData.sku,
        netQuantity: validatedData.netQuantity,
        comfortFeatures: validatedData.comfortFeatures,
        status: validatedData.status,
        originalPrice: validatedData.originalPrice,
        finalPrice: validatedData.finalPrice,
        images: validatedData.images,
        gender: validatedData.gender,
        isFeatured: validatedData.isFeatured,
        isBestSeller: validatedData.isBestSeller,
        category: validatedData.category,
        variants: {
          create: validatedData.variants.map((variant) => ({
            color: variant.color,
            size: variant.size,
            stock: variant.stock,
          })),
        },
      },
    });

    console.log("product", product);

    return { success: true };
  } catch (error) {
    console.error("Error creating product in actions/createProduct:", error);
    return { error: "Failed to create product" };
  }
}

export async function checkWishlistStatus(productId: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return { isInWishlist: false };
    }

    let wishlist: Cart | null = await redis.get(`wishlist-${user.id}`);
    let myWishList = {
      userId: user.id,
      items: wishlist?.items ?? [],
    };

    const existingItemIndex = myWishList.items.findIndex(
      (item) => item.id === productId
    );

    return { isInWishlist: !!existingItemIndex };
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return { error: "Failed to check wishlist status" };
  }
}

export async function buyNow(
  productId: string,
  size: Size,
  color: Color
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }

  try {
    const selectedProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        originalPrice: true,
        finalPrice: true,
        images: true,
        variants: {
          where: {
            size: size,
            color: color,
            stock: { gt: 0 },
          },
        },
      },
    });

    if (!selectedProduct || selectedProduct.variants.length === 0) {
      throw new Error("Product or variant not available");
    }

    // Find the specific variant matching size and color
    let variant = selectedProduct.variants.find(
      (v) => v.size === size && v.color === color
    );

    if (!variant === null || variant === undefined) {
      variant = selectedProduct.variants[0];
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);
    let myCart: Cart = {
      userId: user.id,
      items: [],
    };

    myCart.items = [
      {
        id: selectedProduct.id,
        name: selectedProduct.name,
        finalPrice: selectedProduct.finalPrice,
        originalPrice: selectedProduct.originalPrice,
        imageString: selectedProduct.images[0],
        variant: {
          id: variant.id,
          size: variant.size,
          color: variant.color,
        },
        quantity: 1,
      },
    ];

    await redis.set(`cart-${user.id}`, myCart);
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { error: "Failed to add item to cart" };
  }
}

export async function editProduct(
  formData: z.infer<typeof productSchema> & { id: string }
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    return {
      error: "Unauthorized access",
    };
  }

  try {
    const validatedData = productSchema.parse(formData);

    // Update the product with new data
    const updatedProduct = await prisma.product.update({
      where: {
        id: formData.id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        headline: validatedData.headline,
        material: validatedData.material,
        pattern: validatedData.pattern,
        fitType: validatedData.fitType,
        sleeveType: validatedData.sleeveType,
        collarStyle: validatedData.collarStyle,
        length: validatedData.length,
        countryOfOrigin: validatedData.countryOfOrigin,
        manufacturer: validatedData.manufacturer,
        packer: validatedData.packer,
        sku: validatedData.sku,
        netQuantity: validatedData.netQuantity,
        comfortFeatures: validatedData.comfortFeatures,
        status: validatedData.status,
        originalPrice: validatedData.originalPrice,
        finalPrice: validatedData.finalPrice,
        images: validatedData.images,
        gender: validatedData.gender,
        isFeatured: validatedData.isFeatured,
        isBestSeller: validatedData.isBestSeller,
        category: validatedData.category,
      },
    });

    // Update variants using separate operations
    for (const variant of validatedData.variants) {
      await prisma.productVariant.upsert({
        where: {
          productId_size_color: {
            productId: formData.id,
            size: variant.size,
            color: variant.color,
          },
        },
        update: {
          stock: variant.stock,
        },
        create: {
          productId: formData.id,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
        },
      });
    }

    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      error: "Failed to update product",
    };
  }
}

export async function deleteProduct(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  // Check if the user's email is in the list of admin emails
  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });

  redirect("/dashboard/products");
}

export async function delItem(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const productId = formData.get("productId") as string;
  const variantId = formData.get("variantId") as string;

  let cart: Cart | null = await redis.get(`cart-${user.id}`);
  if (cart && cart.items) {
    const updateCart: Cart = {
      userId: user.id,
      items: cart.items.filter(
        (item) => !(item.id === productId && item.variant.id === variantId)
      ),
    };
    await redis.set(`cart-${user.id}`, updateCart);
  }

  revalidatePath("/bag");
}

export async function createBanner(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  // Check if the user's email is in the list of admin emails
  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      imageString: submission.value.imageString,
      category: submission.value.category,
    },
  });

  redirect("/dashboard/banner");
}

export const getBanner = async (category: string) => {
  const banner = await prisma.banner.findFirst({
    where: {
      category: getCategoryEnum(category.toLowerCase().replace("_", "-")),
    },
  });
  return banner;
};

export async function deleteBanner(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  // Check if the user's email is in the list of admin emails
  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  await prisma.banner.delete({
    where: {
      id: formData.get("bannerId") as string,
    },
  });

  redirect("/dashboard/banner");
}

export async function addItem(
  productId: string,
  size: Size,
  color: Color
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }

  try {
    const selectedProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        originalPrice: true,
        finalPrice: true,
        images: true,
        variants: {
          where: {
            size: size,
            color: color,
            stock: { gt: 0 },
          },
        },
      },
    });

    if (!selectedProduct || selectedProduct.variants.length === 0) {
      throw new Error("Product or variant not available");
    }

    // Find the specific variant matching size and color
    let variant = selectedProduct.variants.find(
      (v) => v.size === size && v.color === color
    );

    if (!variant === null || variant === undefined) {
      variant = selectedProduct.variants[0];
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);
    let myCart: Cart = {
      userId: user.id,
      items: [],
    };

    if (cart?.items) {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.id === productId &&
          item.variant.size === size &&
          item.variant.color === color
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += 1;
        myCart = cart;
      } else {
        myCart = {
          ...cart,
          items: [
            ...cart.items,
            {
              id: selectedProduct.id,
              name: selectedProduct.name,
              originalPrice: selectedProduct.originalPrice,
              finalPrice: selectedProduct.finalPrice,
              imageString: selectedProduct.images[0],
              variant: {
                id: variant.id,
                size: variant.size,
                color: variant.color,
              },
              quantity: 1,
            },
          ],
        };
      }
    } else {
      myCart.items = [
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          finalPrice: selectedProduct.finalPrice,
          originalPrice: selectedProduct.originalPrice,
          imageString: selectedProduct.images[0],
          variant: {
            id: variant.id,
            size: variant.size,
            color: variant.color,
          },
          quantity: 1,
        },
      ];
    }

    await redis.set(`cart-${user.id}`, myCart);
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { error: "Failed to add item to cart" };
  }
}

export async function checkOut() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.items.map((item) => ({
        price_data: {
          currency: "inr",
          unit_amount: item.finalPrice * 100,
          product_data: {
            name: item.name,
            images: [item.imageString],
          },
        },
        quantity: item.quantity,
      }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/payment/success"
          : `${process.env.DEPLOY_URL}/payment/success`,
      cancel_url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/payment/cancel"
          : `${process.env.DEPLOY_URL}/payment/cancel`,
      metadata: {
        userId: user.id,
      },
    });

    return redirect(session.url as string);
  }
}

export async function reduceItemVariantStock(items: {
  id: string;
  name: string;
  originalPrice: number;
  finalPrice: number;
  quantity: number;
  imageString: string;
  variant: {
    id: string;
    size: $Enums.Size;
    color: $Enums.Color;
  };
}[] | undefined) {
  try {
    if (!items) {
      return { success: true, message: "No items to reduce" };
    }

    for (const item of items) {
      await prisma.productVariant.update({
        where: {
          id: item.variant.id,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return { success: true, message: "Item variant stock reduced successfully" };
  } catch (error) {
    console.error("Error reducing item variant stock:", error);
    return { error: "Failed to reduce item variant stock" };
  }
}

export async function clearCartInRedis(userId: string | undefined) {
  try {
    await redis.set(`cart-${userId}`, JSON.stringify({ items: [] }));
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart in Redis:", error);
    return { error: "Failed to clear cart in Redis" };
  }
}

export async function createOrderInDB(orderData: {
  userId: string | undefined;
  address: string;
  amount: number;
  paymentMethod: string;
  discountPrice: number;
  items: {
    id: string;
    name: string;
    originalPrice: number;
    finalPrice: number;
    quantity: number;
    imageString: string;
    variant: {
      id: string;
      size: Size;
      color: Color;
    };
  }[]
}) {
  try {
    if (!orderData.userId) {
      throw new Error("UserId is required");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: orderData.userId,
      },
    });

    await prisma.order.create({
      data: {
        user: {
          connect: {
            id: orderData.userId,
          },
        },
        address: orderData.address,
        amount: orderData.amount / 100,
        paymentMethod: orderData.paymentMethod,
        discountPrice: Math.floor(orderData.discountPrice),
        items: {
          create: orderData.items.map(item => ({
            productId: item.id,
            variantId: item.variant.id,
            quantity: item.quantity,
            price: item.finalPrice,
          })),
        },
        status: "PENDING", // or any default status you prefer
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating order in DB:", error);
    return { error: "Failed to create order in DB" };
  }
}

export async function getVariantsByColor(productId: string, color: Color) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: {
        productId,
        color: color,
      },
      select: {
        size: true,
        color: true,
        stock: true,
      },
    });
    return variants;
  } catch (error) {
    console.error("Error fetching variants:", error);
    throw new Error("Failed to fetch variants");
  }
}

export async function deleteReview(reviewId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  // Check if the user's email is in the list of admin emails
  if (!user || !adminEmails.includes(user.email!)) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
}

export async function addItemWishlist(productId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const selectedProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        finalPrice: true,
        originalPrice: true,
        images: true,
        variants: {
          take: 1,
        },
      },
    });

    if (!selectedProduct) {
      return { error: "Product not found" };
    }

    let wishlist: Cart | null = await redis.get(`wishlist-${user.id}`);
    let myWishList = {
      userId: user.id,
      items: wishlist?.items ?? [],
    };

    const existingItemIndex = myWishList.items.findIndex(
      (item) => item.id === productId
    );

    if (existingItemIndex === -1) {
      myWishList.items.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        originalPrice: selectedProduct.originalPrice,
        finalPrice: selectedProduct.finalPrice,
        imageString: selectedProduct.images[0],
        quantity: 1,
        variant: selectedProduct.variants[0],
      });

      await redis.set(`wishlist-${user.id}`, myWishList);
      revalidatePath("/", "layout");
      return { success: true };
    }

    return { info: "Item already in wishlist" };
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    return { error: "Failed to add item to wishlist" };
  }
}

export async function delItemWishList(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }

  const productId = formData.get("productId") as string;
  let wishlist: Cart | null = await redis.get(`wishlist-${user.id}`);

  if (wishlist && wishlist.items) {
    const updateWishlist: Cart = {
      userId: user.id,
      items: wishlist.items.filter((item) => item.id !== productId),
    };
    await redis.set(`wishlist-${user.id}`, updateWishlist);
  }

  revalidatePath("/wishlist");
}

export const getFeaturedProducts = async () => {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
        status: "PUBLISHED",
      },
      include: {
        variants: true,
      },
    });

    return featuredProducts;
  } catch (error) {
    console.log("error fetching featured products", error);
  }
};

export async function updateQuantity(productId: string, newQuantity: number) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);

    if (!cart?.items) {
      return { error: "Cart not found" };
    }

    const itemIndex = cart.items.findIndex((item) => item.id === productId);

    if (itemIndex === -1) {
      return { error: "Item not found in cart" };
    }

    if (newQuantity < 1 || newQuantity > 10) {
      return { error: "Invalid quantity" };
    }

    cart.items[itemIndex].quantity = newQuantity;
    await redis.set(`cart-${user.id}`, cart);
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Error updating quantity:", error);
    return { error: "Failed to update quantity" };
  }
}

function getCategoryEnum(category: string): Category {
  const formattedCategory = category.toUpperCase().replace(/-/g, "_");
  if (Object.values(Category).includes(formattedCategory as Category)) {
    return formattedCategory as Category;
  }
  throw new Error("Invalid category");
}

function convertToSizeEnum(size: string): Size {
  return size as Size;
}

function convertToColorEnum(color: string): Color {
  const formattedColor = color.toUpperCase();
  return formattedColor as Color;
}

export async function getProducts(
  category: string,
  filters?: FilterFormValues,
  sort?: SortOption
) {
  try {
    let orderBy: any = {};

    // Handle sorting
    switch (sort) {
      case "all":
        orderBy = {};
        break;
      case "price-low-to-high":
        orderBy = { finalPrice: "asc" };
        break;
      case "price-high-to-low":
        orderBy = { finalPrice: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case SortOptions.RATING:
        orderBy = { averageRating: "desc" };
        break;
      case "featured":
      default:
        orderBy = { isFeatured: "desc" };
        break;
    }

    // Base filter structure
    type ProductFilter = {
      status: "PUBLISHED";
      OR?: Array<{ category: Category }>;
      AND?: Array<{
        OR?: Array<Prisma.ProductWhereInput>;
      }>;
      finalPrice?: {
        gte?: number;
        lte?: number;
      };
    };

    const whereClause: ProductFilter = {
      status: "PUBLISHED",
    };

    // Handle category filtering
    if (category === "t-shirts") {
      // Combined T-shirts categories
      whereClause.OR = [
        { category: "T_SHIRTS" as Category },
        { category: "OVERSIZED_TSHIRTS" as Category }
      ];
    } else if (category !== "all-products") {
      whereClause.OR = [{
        category: getCategoryEnum(category)
      }];
    }

    // Handle additional filters if present
    if (filters) {
      const filterConditions: Array<{ OR?: Array<Prisma.ProductWhereInput> }> = [];

      // Handle category filters (overrides main category if present)
      if (filters.categories?.length) {
        const categoryFilters = filters.categories.filter(cat => cat !== "ALL_PRODUCTS");
        if (categoryFilters.length > 0) {
          whereClause.OR = categoryFilters.map(cat => ({
            category: getCategoryEnum(cat.toLowerCase().replace("_", "-"))
          }));
        }
      }

      // Handle size filters
      if (filters.sizes?.length) {
        filterConditions.push({
          OR: filters.sizes.map(size => ({
            variants: {
              some: {
                size: convertToSizeEnum(size)
              }
            }
          })) as Array<Prisma.ProductWhereInput>
        });
      }

      // Handle color filters
      if (filters.colors?.length) {
        filterConditions.push({
          OR: filters.colors.map(color => ({
            variants: {
              some: {
                color: convertToColorEnum(color)
              }
            }
          })) as Array<Prisma.ProductWhereInput>
        });
      }

      // Handle price range filter
      if (filters.priceRange?.length === 2) {
        whereClause.finalPrice = {
          gte: filters.priceRange[0],
          lte: filters.priceRange[1] === Infinity ? undefined : filters.priceRange[1]
        };
      }

      // Add all filter conditions to the where clause
      if (filterConditions.length > 0) {
        whereClause.AND = filterConditions;
      }
    }

    // Fetch products with applied filters
    const data = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      include: {
        reviews: true,
      }
    });

    // Generate appropriate title
    let title = "All Products";
    if (category === "t-shirts") {
      title = "All T-Shirts";
    } else if (category !== "all-products") {
      title = `Products for ${category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`;
    }

    return { title, data };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function submitReview({
  productId,
  rating,
  comment,
}: {
  productId: string;
  rating: number;
  comment: string;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a review");
  }

  try {
    await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId: user.id,
      },
    });

    revalidatePath(`/product/${productId}`);
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}

// function generateTitle(category: string, filters?: FilterFormValues): string {
//   let title = "All Products";
//   if (filters?.categories?.length && filters.categories[0] !== "ALL_PRODUCTS") {
//     title = `Products for ${filters.categories
//       .map((cat) =>
//         cat
//           .split("_")
//           .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
//           .join(" ")
//       )
//       .join(", ")}`;
//   } else if (category !== "all-products") {
//     title = `Products for ${category
//       .split("-")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")}`;
//   }
//   return title;
// }
//
//

export async function createHomePageContent(formData: EditHomeContentValues) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  if (formData.isActive === true) {
    await prisma.homePageContent.updateMany({
      data: { isActive: false }
    })
  }

  try {
    await prisma.homePageContent.create({
      data: {
        ...formData,
      }
    })

    return { success: true }
  } catch (e) {
    console.log(e)
  }
}

export async function deleteHomePageContent(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  await prisma.homePageContent.delete({
    where: {
      id: formData.get("homePageContentId") as string,
    },
  });

  redirect("/dashboard/home");

}

export async function upadateHomePageContent(formData: EditHomeContentValues, id: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  try {

    if (formData.isActive === true) {
      await prisma.homePageContent.updateMany({
        data: { isActive: false }
      })
    }

    await prisma.homePageContent.update({
      where: {
        id: id,
      },
      data: {
        headingLarge: formData.headingLarge,
        headingSmall: formData.headingSmall,
        tagline: formData.tagline,
        description: formData.description,
        cardTitle: formData.cardTitle,
        cardDescription: formData.cardDescription,
        isActive: formData.isActive,
      },
    });

    return { success: true };
  } catch (e) {
    console.log(e);
  }
}


export async function createCouponCode(formData: CouponCodeValue) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    return redirect("/");
  }

  try {
    await prisma.coupon.create({
      data: {
        code: formData.code.trim().toUpperCase(),
        discount: formData.discount,
        isValid: formData.isValid
      }
    })
    return { success: true }

  } catch (e) {
    console.log(e)
  }

}

export async function deleteCoupon(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.coupon.delete({
      where: {
        id: formData.get("couponCodeId") as string,
      },
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw new Error("Failed to delete coupon");
  }

  redirect("/dashboard/coupons");
}

export async function updateCouponCode(formData: CouponCodeValue, id: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  if (!user || !adminEmails.includes(user.email!)) {
    throw new Error("Unauthorized");
  }


  try {
    await prisma.coupon.update({
      where: {
        id: id,
      },
      data: {
        code: formData.code.trim().toUpperCase(),
        discount: formData.discount,
        isValid: formData.isValid
      }
    })
    return { success: true }

  } catch (e) {
    console.log(e)
  }

}

export async function validateCoupon(code: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a review");
  }

  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.trim().toUpperCase(),
        isValid: true
      },
      select: {
        discount: true
      }
    })

    if (!coupon) {
      return { success: false, message: "Coupon code not found" }
    }

    return { success: true, discount: coupon.discount }

  } catch (e) {
    return { success: false, message: "error validating coupon code" }
  }
}

export async function updateCouponUsage(price: number, couponCode: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return { success: false, message: "User not found" }
  }

  try {
    const couponUsage = await prisma.coupon.update({
      where: {
        code: couponCode
      },
      data: {
        totalRevenue: {
          increment: price
        }
      },
    });

    return {
      success: true,
      message: "Coupon usage updated successfully",
      coupon: couponUsage
    };
  } catch (error) {
    console.error("Error updating coupon usage:", error);
    return {
      success: false,
      message: "Failed to update coupon usage"
    };
  }

}
