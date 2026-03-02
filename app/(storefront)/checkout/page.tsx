import React from 'react'
import { redis } from "@/app/lib/redis";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { Cart } from '@/app/lib/interfaces';
import CheckoutComponent from '@/components/CheckoutComponent';

const CheckooutPage = async () => {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const cart: Cart | null = await redis.get(`cart-${user?.id}`);

  let totalPrice = 0;
  let totalItems = 0;

  cart?.items.forEach((item) => {
    totalPrice += item.finalPrice * item.quantity;
    totalItems += item.quantity;
  });
  return (
    <CheckoutComponent cart={cart} totalPrice={totalPrice} totalItems={totalItems} />
  )
}

export default CheckooutPage
