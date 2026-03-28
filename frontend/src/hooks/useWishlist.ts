import { useState, useCallback } from "react";
import {
  WishlistItem,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/lib/wishlist";

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>(() => getWishlist());

  const refresh = useCallback(() => setItems(getWishlist()), []);

  const add = useCallback(
    (item: WishlistItem) => {
      addToWishlist(item);
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      removeFromWishlist(id);
      refresh();
    },
    [refresh]
  );

  const toggle = useCallback(
    (item: WishlistItem) => {
      if (isInWishlist(item.id)) {
        remove(item.id);
      } else {
        add(item);
      }
    },
    [add, remove]
  );

  return { items, add, remove, toggle, count: items.length };
};
