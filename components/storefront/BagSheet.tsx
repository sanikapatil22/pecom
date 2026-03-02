import { delItem } from "@/app/actions";
import { redis } from "@/app/lib/redis";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { DeleteItem } from "@/components/SubmitButtons";
import { CartQuantityButtons } from "./CartQuantityBUtton";
import CartSheetComponent from "../CartSheetComponent";
import { SheetClose } from "../ui/sheet";
import Link from "next/link";

export interface CartItem {
  id: string;
  name: string;
  originalPrice: number;
  finalPrice: number;
  quantity: number;
  imageString: string;
  category: string;
  variant: {
    id: string;
    color: string;
    size: string;
  };
}

export interface Cart {
  items: CartItem[];
}

export default async function CartSheet() {
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
    <CartSheetComponent totalItems={totalItems} cart={cart} totalPrice={totalPrice} />
  );
}

export function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-14 h-14 border border-neutral-200 flex items-center justify-center mb-4">
        <ShoppingBag className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-sm uppercase tracking-[0.15em] font-medium mb-2">Your bag is empty</h2>
      <p className="text-neutral-500 text-sm mb-6 max-w-xs mx-auto">
        Looks like you haven&apos;t added anything yet.
      </p>
      <SheetClose asChild>
        <Link
          href="/collections/all-products"
          className="inline-block bg-black text-white text-xs uppercase tracking-[0.15em] font-medium px-8 py-3 hover:bg-neutral-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </SheetClose>
    </div>
  );
}

export function CartItemComponent({ item }: { item: CartItem }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <div className="relative w-20 h-24 flex-shrink-0 bg-neutral-100">
        <Image
          src={item.imageString}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide truncate pr-2">{item.name}</h3>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
              {item.variant.color} / {item.variant.size}
            </p>
          </div>
          <form action={delItem}>
            <input type="hidden" name="productId" value={item.id} />
            <input type="hidden" name="variantId" value={item.variant.id} />
            <DeleteItem>
              <Trash2 className="w-3.5 h-3.5 text-neutral-400 hover:text-black transition-colors" />
            </DeleteItem>
          </form>
        </div>
        <div className="flex justify-between items-center mt-3">
          <CartQuantityButtons
            itemId={item.id}
            initialQuantity={item.quantity}
          />
          <p className="text-sm font-medium">
            ₹{(item.finalPrice * item.quantity).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}
