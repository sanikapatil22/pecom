import { Color, Size } from "@prisma/client";

export type Cart = {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    originalPrice: number;
    finalPrice: number;
    quantity: number;
    imageString: string;
    variant: {
      id: string;
      size: Size;
      color : Color;
    };
  }>;
};

interface WishlistItem {
 id: string;
 imageString: string;
 name: string;
 finalPrice : number;
 quantity: number;
}

interface Wishlist {
 userId: string;
 items: WishlistItem[];
}
