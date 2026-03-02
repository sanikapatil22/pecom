import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag } from 'lucide-react';
import { Cart, CartItemComponent, EmptyCart } from './storefront/BagSheet';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

type Props = {
  totalItems: number;
  totalPrice: number;
  cart: Cart | null;
}

const CartSheetComponent = ({ totalItems, cart, totalPrice }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className="text-white hover:text-gray-300 transition-colors relative p-0 cursor-pointer"
          aria-label="Shopping bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-2xl font-bold flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6" />
            <span>Shopping Cart ({totalItems})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={`${item.id}-${item.variant.color}`}>
                    <CartItemComponent item={item} />
                    {index < cart.items.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Separator />
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium mb-3">Cart Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-lg text-orange-500">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <SheetClose asChild>
                  <Link
                    href={`/checkout`}
                    className={cn(buttonVariants(), "w-full py-2")}
                  >
                    Checkout
                  </Link>
                </SheetClose>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheetComponent
