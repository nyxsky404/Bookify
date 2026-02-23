import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { booksTable } from './books';
import { usersTable } from './users';

export const cartsTable = pgTable('carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cartItemsTable = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartId: uuid('cart_id').notNull().references(() => cartsTable.id, { onDelete: 'cascade' }),
  bookId: uuid('book_id').notNull().references(() => booksTable.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

export type CartRow = typeof cartsTable.$inferSelect;
export type NewCartRow = typeof cartsTable.$inferInsert;
export type CartItemRow = typeof cartItemsTable.$inferSelect;
export type NewCartItemRow = typeof cartItemsTable.$inferInsert;
