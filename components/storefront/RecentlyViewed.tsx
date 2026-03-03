"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RecentProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}

const STORAGE_KEY = "pamara_recently_viewed";

export function trackRecentlyViewed(product: RecentProduct) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  const existing: RecentProduct[] = stored ? JSON.parse(stored) : [];
  const filtered = existing.filter((p) => p.id !== product.id);
  const updated = [product, ...filtered].slice(0, 8);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

interface Props {
  currentProductId: string;
}

export default function RecentlyViewed({ currentProductId }: Props) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const all: RecentProduct[] = JSON.parse(stored);
    setProducts(all.filter((p) => p.id !== currentProductId));
  }, [currentProductId]);

  if (products.length === 0) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-20">
      <div className="flex justify-center mb-10">
        <h2 className="text-sm uppercase tracking-[0.25em] font-medium bg-neutral-100 inline-block px-6 py-2">
          Recently Viewed
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {products.slice(0, 4).map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group block">
            <div
              className="relative w-full overflow-hidden bg-neutral-100"
              style={{ paddingTop: "133.33%" }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-xs uppercase tracking-[0.1em] font-medium line-clamp-2 text-center">
                {product.name}
              </h3>
              <p className="text-sm text-center text-neutral-600">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
