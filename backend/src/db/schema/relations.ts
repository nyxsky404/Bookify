import { relations } from 'drizzle-orm';
import { salesReportsTable } from './analytics';
import { auditLogsTable } from './audit';
import { booksTable } from './books';
import { cartsTable, cartItemsTable } from './carts';
import { categoriesTable } from './categories';
import { notificationsTable } from './notifications';
import { ordersTable, orderItemsTable } from './orders';
import { usersTable } from './users';

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  cart: one(cartsTable, { fields: [usersTable.id], references: [cartsTable.userId] }),
  orders: many(ordersTable),
  notifications: many(notificationsTable),
  auditLogs: many(auditLogsTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  books: many(booksTable),
}));

export const booksRelations = relations(booksTable, ({ one, many }) => ({
  category: one(categoriesTable, { fields: [booksTable.categoryId], references: [categoriesTable.id] }),
  cartItems: many(cartItemsTable),
  orderItems: many(orderItemsTable),
}));

export const cartsRelations = relations(cartsTable, ({ one, many }) => ({
  user: one(usersTable, { fields: [cartsTable.userId], references: [usersTable.id] }),
  items: many(cartItemsTable),
}));

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartsTable, { fields: [cartItemsTable.cartId], references: [cartsTable.id] }),
  book: one(booksTable, { fields: [cartItemsTable.bookId], references: [booksTable.id] }),
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, { fields: [ordersTable.userId], references: [usersTable.id] }),
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, { fields: [orderItemsTable.orderId], references: [ordersTable.id] }),
  book: one(booksTable, { fields: [orderItemsTable.bookId], references: [booksTable.id] }),
}));

export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
  user: one(usersTable, { fields: [notificationsTable.userId], references: [usersTable.id] }),
}));

export const auditLogsRelations = relations(auditLogsTable, ({ one }) => ({
  user: one(usersTable, { fields: [auditLogsTable.userId], references: [usersTable.id] }),
}));
