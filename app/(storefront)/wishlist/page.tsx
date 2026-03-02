import { delItemWishList } from "@/app/actions";
import { redis } from "@/app/lib/redis";
import { Button, buttonVariants } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cart } from "@/app/lib/interfaces";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface WishlistItem {
  id: string;
  name: string;
  originalPrice: number;
  finalPrice: number;
  quantity: number;
  imageString: string;
}

export interface Wishlist {
  items: WishlistItem[];
}

export default async function WishlistPage() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const wishlist: Cart | null = await redis.get(`wishlist-${user.id}`);
  const totalItems = wishlist?.items.length ?? 0;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-lg font-medium">My Wishlist</h1>
        <span className="text-muted-foreground">{totalItems} items</span>
      </div>
      {!wishlist || !wishlist.items || wishlist.items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Saved Items ({totalItems} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {wishlist.items.map((item) => (
                <WishlistItemCard key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmptyWishlist() {
  return (
    <Card className="text-center py-8">
      <CardContent className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Add items you love to your wishlist. Review them anytime and add
            them to your cart!
          </p>
        </div>
        <Button asChild>
          <Link
            href="/"
            className="active:scale-95 transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function WishlistItemCard({ item }: { item: WishlistItem }) {
  return (
    <Card className="relative group h-full p-6">
      <form action={delItemWishList} className="absolute right-2 top-2 z-10">
        <input type="hidden" name="productId" value={item.id} />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white hover:bg-gray-100 rounded-full shadow-sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </form>

      <div className="space-y-2 flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden rounded-md">
          <Image
            alt={item.name}
            src={item.imageString}
            height={500}
            width={500}
            className="object-contain w-full h-full transition-transform group-hover:scale-105 max-h-[200px]"
          />
          {item.quantity === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              OUT OF STOCK
            </div>
          )}
        </div>

        <div className="px-1 space-y-2 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
              {item.name}
            </h3>
            <p className="text-sm font-semibold">
              ₹{item.finalPrice.toFixed(2)}
            </p>
          </div>
          <Link
            href={`/product/${item.id}`}
            className={cn(
              "w-full text-xs h-8",
              buttonVariants({ variant: "outline" })
            )}
          >
            View Product
          </Link>
        </div>
      </div>
    </Card>
  );
}
