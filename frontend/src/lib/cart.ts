import { apiClient, AddToCartDto, UpdateCartItemDto } from "./api";

export interface CartItem {
  id: string;
  cartId: string;
  bookId: string;
  quantity: number;
  addedAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    imageUrl?: string;
    stockQuantity: number;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export class CartService {
  async getCart(): Promise<Cart> {
    return apiClient.get<Cart>("/cart");
  }

  async addItem(bookId: string, quantity: number): Promise<Cart> {
    return apiClient.post<Cart>("/cart/items", { bookId, quantity });
  }

  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    return apiClient.patch<Cart>(`/cart/items/${itemId}`, { quantity });
  }

  async removeItem(itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/items/${itemId}`);
  }

  async clearCart(): Promise<void> {
    return apiClient.delete("/cart");
  }
}

export const cartService = new CartService();
