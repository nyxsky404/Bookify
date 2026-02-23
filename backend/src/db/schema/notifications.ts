import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const notificationTypeEnum = pgEnum('notification_type', [
  'ORDER_PLACED',
  'ORDER_SHIPPED',
  'ORDER_DELIVERED',
  'LOW_STOCK_ALERT',
  'ORDER_CANCELLED',
]);

export const notificationsTable = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type NotificationRow = typeof notificationsTable.$inferSelect;
export type NewNotificationRow = typeof notificationsTable.$inferInsert;
