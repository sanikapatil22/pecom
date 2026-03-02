import React from 'react';
import { Order, Prisma } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, IndianRupee, Calendar, Clock, Box } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Update the OrderWithItems type to include the new fields
type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
        variant: true;
      };
    };
    _count: true;
  }
}> & {
  trackingId?: string | null;
  arrivalDate?: string | null;
  courierName?: string | null;
};

type Props = {
  orders: OrderWithItems[];
};

const MyOrdersComponent = ({ orders }: Props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const calculateSavings = (originalPrice: number, finalPrice: number) => {
    const savings = originalPrice - finalPrice;
    const savingsPercentage = Math.round((savings / originalPrice) * 100);
    return { savings, savingsPercentage };
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Order #{order.id.slice(0, 8)}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {formatDate(new Date(order.createdAt).toLocaleDateString())}
              </div>
            </div>
            <Badge className={`${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                <span>₹{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>{order._count.items} items</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Add Shipping Information */}
            {(order.trackingId || order.courierName || order.arrivalDate) && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Shipping Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {order.trackingId && (
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4" />
                      <span>Tracking ID: {order.trackingId}</span>
                    </div>
                  )}
                  {order.courierName && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Courier: {order.courierName}</span>
                    </div>
                  )}
                  {order.arrivalDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Expected Arrival: {order.arrivalDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h4 className="mb-2 font-semibold">Delivery Address</h4>
              <p className="text-sm text-gray-600">{order.address}</p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Order Items</h4>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const { savings, savingsPercentage } = calculateSavings(
                    item.product.originalPrice,
                    item.product.finalPrice
                  );
                  return (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Product Image */}
                        <div className="aspect-square relative rounded-md overflow-hidden h-[500px] md:w-[400px]">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="md:col-span-2 space-y-2">
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Size: {item.variant?.size}</p>
                            <p>Color: {item.variant?.color}</p>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                          <div className="flex gap-2 items-baseline">
                            <span className="font-semibold">₹{item.product.finalPrice}</span>
                            <span className="text-sm text-gray-500 line-through">₹{item.product.originalPrice}</span>
                            <Badge className="bg-green-500">
                              {savingsPercentage}% OFF
                            </Badge>
                          </div>
                          <p className="text-sm">
                            {item.product.manufacturer} • {item.product.material}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyOrdersComponent;
