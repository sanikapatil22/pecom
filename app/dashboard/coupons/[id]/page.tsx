import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import EditCouponCodeContent from "@/components/dashboard/EditCouponcodeContent";

async function getData(couponCodeId: string) {
  const data = await prisma.coupon.findUnique({
    where: {
      id: couponCodeId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function EditRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);

  return <EditCouponCodeContent data={data} />;
}


