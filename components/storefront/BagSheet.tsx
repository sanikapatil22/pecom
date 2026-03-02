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
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

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
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6 max-w-xs mx-auto">
        Looks like you haven&apos;t added anything yet. Start shopping to fill
        it up!
      </p>
      <SheetClose asChild>
        <a
          href="/collections/all-products"
          className={cn(buttonVariants(), "w-full")}
        >
          Continue Shopping
        </a>
      </SheetClose>
    </div>
  );
}

export function CartItemComponent({ item }: { item: CartItem }) {
  return (
    <div className="flex items-start space-x-4 p-4 border border-gray-300 rounded-md bg-gray-100/80">
      <div className="relative w-20 h-20 rounded-sm overflow-hidden flex-shrink-0">
        <Image
          src={item.imageString}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover bg-gray-50"
        />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium truncate pr-2">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{item.category}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full border border-gray-300"
                style={{
                  backgroundColor: item.variant.color.toLowerCase(),
                  border:
                    item.variant.color.toLowerCase() === "white"
                      ? "1px solid #e5e7eb"
                      : "none",
                }}
              />
              {item.variant.color} • Size {item.variant.size}
            </p>

          </div>
          <form action={delItem}>
            <input type="hidden" name="productId" value={item.id} />
            <input type="hidden" name="variantId" value={item.variant.id} />
            <DeleteItem>
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
            </DeleteItem>
          </form>
        </div>
        <div className="flex justify-between items-center mt-2">
          <CartQuantityButtons
            itemId={item.id}
            initialQuantity={item.quantity}
          />
          <p className="font-medium">
            ₹{(item.finalPrice * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
