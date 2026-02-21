import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const categoriesTable = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type CategoryRow = typeof categoriesTable.$inferSelect;
export type NewCategoryRow = typeof categoriesTable.$inferInsert;
