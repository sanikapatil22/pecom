import { Suspense } from "react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import ProductDetails from "@/components/ProductDetails";
import ProductTracker from "@/components/storefront/ProductTracker";
import RecentlyViewed from "@/components/storefront/RecentlyViewed";
import Loading from "./loading";
import prisma from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";

async function getData(productId: string) {
  const data = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      reviews: { include: { user: true } },
      variants: true,
    },
  });

  if (!data) return notFound();
  return data;
}

async function getRelatedProducts(productId: string, category: string, gender: string) {
  return prisma.product.findMany({
    where: {
      id: { not: productId },
      category: category as any,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      name: true,
      images: true,
      finalPrice: true,
      originalPrice: true,
      variants: { select: { color: true }, distinct: ["color"] },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
}

const colorMap: Record<string, string> = {
  BLACK: "#000000", WHITE: "#FFFFFF", GRAY: "#808080", RED: "#DC2626",
  BLUE: "#2563EB", GREEN: "#16A34A", YELLOW: "#EAB308", PURPLE: "#9333EA",
  PINK: "#EC4899", ORANGE: "#EA580C", NAVY: "#1E3A5F", BROWN: "#78350F",
  DUSTY_GREEN: "#6B8E6B", MAROON: "#800000", COOKIE: "#C68E4E",
  BEIGE: "#D4B896", SKY_BLUE: "#7DD3FC", LIGHT_GREEN: "#86EFAC", KHAKI: "#BDB76B",
};

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  const relatedProducts = await getRelatedProducts(params.id, data.category, data.gender);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Suspense fallback={<Loading />}>
      {/* Track this product in recently viewed */}
      <ProductTracker
        id={data.id}
        name={data.name}
        image={data.images[0]}
        price={data.finalPrice}
      />

      <ProductDetails data={data} />

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-20 border-t border-neutral-100">
          <h2 className="text-sm uppercase tracking-[0.25em] font-medium text-center mb-10">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {relatedProducts.map((product) => {
              const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
              return (
                <Link key={product.id} href={`/product/${product.id}`} className="group block">
                  <div
                    className="relative w-full overflow-hidden bg-neutral-100"
                    style={{ paddingTop: "133.33%" }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <h3 className="text-xs uppercase tracking-[0.1em] font-medium line-clamp-2 text-center">
                      {product.name}
                    </h3>
                    <p className="text-sm text-center text-neutral-600">
                      {formatPrice(product.finalPrice)}
                    </p>
                    {uniqueColors.length > 0 && (
                      <div className="flex justify-center gap-1.5 pt-1">
                        {uniqueColors.slice(0, 5).map((color) => (
                          <span
                            key={color}
                            className="w-4 h-4 border border-neutral-200"
                            style={{ background: colorMap[color] || "#ccc" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      <div className="bg-neutral-50">
        <RecentlyViewed currentProductId={params.id} />
      </div>
    </Suspense>
  );
}
