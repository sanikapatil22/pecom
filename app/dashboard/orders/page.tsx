import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import prisma from '@/app/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import OrderStateSelector from '@/components/storefront/OrderStateSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import TrackingIdForm from '@/components/storefront/TrackingIdForm';
import ArrivalDateForm from '@/components/storefront/ArrivalDateForm';
import CourierNameForm from '@/components/storefront/CourierNameForm';

// Enum for Order Status
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Enum for Payment Method
enum PaymentMethod {
  COD = 'cod',
  ONLINE = 'online'
}

// Type definition for Order
type Order = {
  id: string;
  paymentMethod: PaymentMethod;
  amount: number;
  createdAt: Date;
  status: OrderStatus;
  trackingId?: string;
  arriavalDate? : string;
  courierName? : string;
  address?: string;
  items: {
    quantity: number;
    price: number;
    id: string;
    variant?: {
      id: string;
      size: string;
      color: string;
    };
    product: {
      name: string;
      sku: string;
    };
  }[];
  user?: {
    firstName?: string;
    email?: string;
    profileImage?: string;
  };
}

async function getData(): Promise<Order[]> {
  noStore();
  const data = await prisma.order.findMany({
    select: {
      paymentMethod: true,
      amount: true,
      createdAt: true,
      status: true,
      trackingId: true,
      arrivalDate : true,
      courierName : true,
      address: true,
      items: {
        select: {
          quantity: true,
          price: true,
          id: true,
          variant: true,
          product: {
            select: {
              name: true,
              sku: true,
            }
          }
        }
      },
      id: true,
      user: {
        select: {
          firstName: true,
          email: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data as Order[];
}

export default async function OrdersPage() {
  const data = await getData();

  // Group orders by status and payment method
  const orderGroups = {
    status: Object.values(OrderStatus).reduce((acc, status) => {
      acc[status] = data.filter(order => order.status === status);
      return acc;
    }, {} as Record<OrderStatus, Order[]>),
    paymentMethod: Object.values(PaymentMethod).reduce((acc, method) => {
      acc[method] = data.filter(order => order.paymentMethod === method);
      return acc;
    }, {} as Record<PaymentMethod, Order[]>)
  };

  const renderOrderCard = (order: Order) => (
    <Card key={order.id}>
      <CardHeader className="px-7">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Order ID: {order.id}</CardDescription>
          </div>
          <TrackingIdForm orderId={order.id} trackingId={order.trackingId}/>
          <ArrivalDateForm orderId={order.id} arrivalDate={order.arriavalDate}/>
          <CourierNameForm orderId={order.id} courierName={order.courierName}/>
          <OrderStateSelector defaultValue={order.status} orderId={order.id} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer</h3>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={order.user?.profileImage || ''} />
                <AvatarFallback>
                  {order.user?.firstName?.charAt(0) || 'UN'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.user?.firstName}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="text-sm text-muted-foreground">
              {order.address && <p>{order.address}</p>}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>
                    {item.variant?.id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-fit justify-start">
                            {item.variant?.size} <ChevronDown className="h-4 w-4 ml-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                          <DropdownMenuItem className="flex flex-col items-start">
                            <span className="font-medium">Sku: {item.product.sku}</span>
                            <span className="text-muted-foreground">Size: {item.variant?.size}</span>
                            <span className="text-muted-foreground">Color: {item.variant?.color}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-muted-foreground">Variant Deleted</span>
                    )}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ₹{new Intl.NumberFormat('en-IN').format(item.price)}
                  </TableCell>
                  <TableCell className="text-right">{order.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Order Summary */}
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="text-sm">
              Total Amount:
              <span className="font-semibold ml-2">
                ₹{new Intl.NumberFormat('en-IN').format(order.amount)}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Order Date: {new Intl.DateTimeFormat('en-US').format(order.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="status">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status">Order Status</TabsTrigger>
          <TabsTrigger value="payment">Payment Method</TabsTrigger>
        </TabsList>

        {/* Order Status Tabs */}
        <TabsContent value="status">
          <Tabs defaultValue={OrderStatus.PENDING}>
            <TabsList className="grid w-full grid-cols-5">
              {Object.values(OrderStatus).map((status) => (
                <TabsTrigger key={status} value={status}>
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.values(OrderStatus).map((status) => (
              <TabsContent key={status} value={status}>
                <div className="space-y-4">
                  {orderGroups.status[status].length > 0 ? (
                    orderGroups.status[status].map(renderOrderCard)
                  ) : (
                    <p className="text-center text-muted-foreground">No orders in this status</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Payment Method Tabs */}
        <TabsContent value="payment">
          <Tabs defaultValue={PaymentMethod.COD}>
            <TabsList className="grid w-full grid-cols-2">
              {Object.values(PaymentMethod).map((method) => (
                <TabsTrigger key={method} value={method}>
                  {method}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.values(PaymentMethod).map((method) => (
              <TabsContent key={method} value={method}>
                <div className="space-y-4">
                  {orderGroups.paymentMethod[method].length > 0 ? (
                    orderGroups.paymentMethod[method].map(renderOrderCard)
                  ) : (
                    <p className="text-center text-muted-foreground">No orders with this payment method</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
