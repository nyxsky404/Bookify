import { CartItem } from '../domain/CartItem';
import { CartWithItems, ICartRepository } from '../repositories/interfaces/ICartRepository';
import { IBookRepository } from '../repositories/interfaces/IBookRepository';
import { ApiError } from '../utils/apiError';

export interface SerializedCartItem {
  id: string;
  cartId: string;
  bookId: string;
  quantity: number;
  addedAt: Date;
  book: { id: string; title: string; author: string; price: number; imageUrl?: string; stockQuantity: number } | null;
}

export interface SerializedCart {
  id: string;
  userId: string;
  items: SerializedCartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CartService {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly bookRepo: IBookRepository,
  ) {}

  async getCart(userId: string): Promise<CartWithItems> {
    let cart = await this.cartRepo.findByUserId(userId);
    if (!cart) cart = await this.cartRepo.createCart(userId);
    return cart;
  }

  async addToCart(userId: string, bookId: string, quantity: number): Promise<CartItem> {
    const book = await this.bookRepo.findById(bookId);
    if (!book) throw ApiError.notFound('Book not found');
    if (book.stockQuantity < quantity) {
      throw ApiError.badRequest(`Only ${book.stockQuantity} copies available`);
    }

    const cart = await this.getCart(userId);
    const existing = await this.cartRepo.findItemByBookId(cart.id, bookId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (book.stockQuantity < newQty) {
        throw ApiError.badRequest(`Only ${book.stockQuantity} copies available`);
      }
      return this.cartRepo.updateItemQuantity(existing.id, newQty);
    }
    return this.cartRepo.addItem(cart.id, bookId, quantity);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number): Promise<CartItem> {
    const cart = await this.getCart(userId);
    const item = await this.cartRepo.findItemById(itemId);
    if (!item || item.cartId !== cart.id) throw ApiError.notFound('Cart item not found');

    const book = await this.bookRepo.findById(item.bookId);
    if (!book) throw ApiError.notFound('Book not found');
    if (book.stockQuantity < quantity) {
      throw ApiError.badRequest(`Only ${book.stockQuantity} copies available`);
    }
    return this.cartRepo.updateItemQuantity(itemId, quantity);
  }

  async removeCartItem(userId: string, itemId: string): Promise<void> {
    const cart = await this.getCart(userId);
    const item = await this.cartRepo.findItemById(itemId);
    if (!item || item.cartId !== cart.id) throw ApiError.notFound('Cart item not found');
    await this.cartRepo.removeItem(itemId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    await this.cartRepo.clearCart(cart.id);
  }

  async getSerializedCart(userId: string): Promise<SerializedCart> {
    const cart = await this.getCart(userId);
    const enrichedItems: SerializedCartItem[] = await Promise.all(
      cart.items.map(async (item) => {
        const book = await this.bookRepo.findById(item.bookId);
        return {
          id: item.id,
          cartId: item.cartId,
          bookId: item.bookId,
          quantity: item.quantity,
          addedAt: item.addedAt,
          book: book
            ? { id: book.id, title: book.title, author: book.author, price: book.price, imageUrl: book.imageUrl ?? undefined, stockQuantity: book.stockQuantity }
            : null,
        };
      }),
    );
    const totalAmount = parseFloat(
      enrichedItems.reduce((sum, item) => sum + (item.book?.price ?? 0) * item.quantity, 0).toFixed(2),
    );
    return { id: cart.id, userId: cart.userId, items: enrichedItems, totalAmount, createdAt: cart.createdAt, updatedAt: cart.updatedAt };
  }
}
