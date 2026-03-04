import { and, eq } from 'drizzle-orm';
import { getDb } from '../../config/database';
import { cartItemsTable, cartsTable } from '../../db/schema';
import { CartItem } from '../../domain/CartItem';
import { CartWithItems, ICartRepository } from '../interfaces/ICartRepository';

function rowToCartItem(row: typeof cartItemsTable.$inferSelect): CartItem {
  return new CartItem(row.id, row.cartId, row.bookId, row.quantity, row.addedAt);
}

export class DrizzleCartRepository implements ICartRepository {
  private get db() { return getDb(); }

  async findByUserId(userId: string): Promise<CartWithItems | null> {
    const carts = await this.db.select().from(cartsTable).where(eq(cartsTable.userId, userId)).limit(1);
    if (!carts[0]) return null;
    const cart = carts[0];
    const items = await this.db.select().from(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
    return { ...cart, items: items.map(rowToCartItem) };
  }

  async createCart(userId: string): Promise<CartWithItems> {
    const rows = await this.db.insert(cartsTable).values({ userId }).returning();
    return { ...rows[0], items: [] };
  }

  async findItemById(itemId: string): Promise<CartItem | null> {
    const rows = await this.db.select().from(cartItemsTable).where(eq(cartItemsTable.id, itemId)).limit(1);
    return rows[0] ? rowToCartItem(rows[0]) : null;
  }

  async findItemByBookId(cartId: string, bookId: string): Promise<CartItem | null> {
    const rows = await this.db.select().from(cartItemsTable)
      .where(and(eq(cartItemsTable.cartId, cartId), eq(cartItemsTable.bookId, bookId))).limit(1);
    return rows[0] ? rowToCartItem(rows[0]) : null;
  }

  async addItem(cartId: string, bookId: string, quantity: number): Promise<CartItem> {
    const rows = await this.db.insert(cartItemsTable).values({ cartId, bookId, quantity }).returning();
    return rowToCartItem(rows[0]);
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    const rows = await this.db.update(cartItemsTable).set({ quantity })
      .where(eq(cartItemsTable.id, itemId)).returning();
    if (!rows[0]) throw new Error('Cart item not found');
    return rowToCartItem(rows[0]);
  }

  async removeItem(itemId: string): Promise<void> {
    await this.db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
  }

  async clearCart(cartId: string): Promise<void> {
    await this.db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));
  }
}
