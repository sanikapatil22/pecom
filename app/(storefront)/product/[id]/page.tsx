import { Suspense } from "react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import ProductDetails from "@/components/ProductDetails";
import Loading from "./loading";
import prisma from "@/app/lib/db";

async function getData(productId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      reviews: {
        include: {
          user: true,
        },
      },
      variants: true,
    }
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  return (
    <Suspense fallback={<Loading />}>
      <ProductDetails data={data} />
    </Suspense>
  );
}
