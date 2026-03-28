export interface WishlistItem {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
}

const KEY = "bookify_wishlist";

export const getWishlist = (): WishlistItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const addToWishlist = (item: WishlistItem): void => {
  const list = getWishlist();
  if (!list.find((b) => b.id === item.id)) {
    localStorage.setItem(KEY, JSON.stringify([...list, item]));
  }
};

export const removeFromWishlist = (id: string): void => {
  localStorage.setItem(KEY, JSON.stringify(getWishlist().filter((b) => b.id !== id)));
};

export const isInWishlist = (id: string): boolean =>
  getWishlist().some((b) => b.id === id);
