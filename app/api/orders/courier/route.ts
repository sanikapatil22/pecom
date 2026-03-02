import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, courierName } = body;

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        courierName,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating courier name:", error);
    return NextResponse.json(
      { error: "Error updating courier name" },
      { status: 500 }
    );
  }
}