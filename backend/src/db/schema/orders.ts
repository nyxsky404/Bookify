import { decimal, integer, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { booksTable } from './books';
import { usersTable } from './users';

export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]);

export const ordersTable = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'restrict' }),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default('PENDING'),
  shippingStreet: varchar('shipping_street', { length: 500 }).notNull(),
  shippingCity: varchar('shipping_city', { length: 100 }).notNull(),
  shippingState: varchar('shipping_state', { length: 100 }).notNull(),
  shippingZipCode: varchar('shipping_zip_code', { length: 20 }).notNull(),
  shippingCountry: varchar('shipping_country', { length: 100 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull().default('SIMULATED'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deliveredAt: timestamp('delivered_at'),
});

export const orderItemsTable = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => ordersTable.id, { onDelete: 'cascade' }),
  bookId: uuid('book_id').notNull().references(() => booksTable.id, { onDelete: 'restrict' }),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: decimal('price_at_purchase', { precision: 10, scale: 2 }).notNull(),
});

export type OrderRow = typeof ordersTable.$inferSelect;
export type NewOrderRow = typeof ordersTable.$inferInsert;
export type OrderItemRow = typeof orderItemsTable.$inferSelect;
export type NewOrderItemRow = typeof orderItemsTable.$inferInsert;
