"use client";

import { useEffect } from "react";
import { trackRecentlyViewed } from "./RecentlyViewed";

interface Props {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function ProductTracker({ id, name, image, price }: Props) {
  useEffect(() => {
    trackRecentlyViewed({ id, name, image, price });
  }, [id, name, image, price]);

  return null;
}
