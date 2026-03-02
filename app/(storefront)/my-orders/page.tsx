import prisma from '@/app/lib/db'
import MyOrdersComponent from '@/components/storefront/MyOrdersComponent';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const MyOrdersPage = async (props: Props) => {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user?.id
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true
        }
      },
      _count: true
    }
  })

  console.log("Orders", orders)

  return (
    <MyOrdersComponent orders={orders} />
  )
}

export default MyOrdersPage
