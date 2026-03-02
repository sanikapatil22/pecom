import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function PATCH(request: Request) {
  try {
    const { orderId, trackingId } = await request.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { trackingId },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating tracking ID:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking ID' },
      { status: 500 }
    );
  }
}