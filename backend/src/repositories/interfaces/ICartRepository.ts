import { CartItem } from '../../domain/CartItem';

export interface CartWithItems {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
}

export interface ICartRepository {
  findByUserId(userId: string): Promise<CartWithItems | null>;
  createCart(userId: string): Promise<CartWithItems>;
  findItemById(itemId: string): Promise<CartItem | null>;
  findItemByBookId(cartId: string, bookId: string): Promise<CartItem | null>;
  addItem(cartId: string, bookId: string, quantity: number): Promise<CartItem>;
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
}
