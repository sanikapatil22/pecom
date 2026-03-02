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
          className="text-neutral-700 hover:text-black transition-colors relative p-0 cursor-pointer"
          aria-label="Shopping bag"
        >
          <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pr-6">
          <SheetTitle className="text-lg font-medium uppercase tracking-[0.1em]">
            Your Bag ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
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
          )}
        </div>

        {cart && cart.items && cart.items.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase tracking-wider text-xs">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase tracking-wider text-xs">Shipping</span>
                <span className="text-xs uppercase tracking-wider">Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-base">
                <span className="uppercase tracking-wider text-sm">Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <SheetClose asChild>
              <Link
                href="/checkout"
                className="block w-full bg-black text-white text-center py-3 text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Checkout
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartSheetComponent
