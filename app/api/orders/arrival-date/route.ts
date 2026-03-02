import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, arrivalDate } = body;

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        arrivalDate,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating arrival date:", error);
    return NextResponse.json(
      { error: "Error updating arrival date" },
      { status: 500 }
    );
  }
}