import { decimal, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { categoriesTable } from './categories';

export const booksTable = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => categoriesTable.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 500 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  isbn: varchar('isbn', { length: 20 }).unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  imageUrl: varchar('image_url', { length: 1000 }),
  publishedYear: integer('published_year'),
  publisher: varchar('publisher', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type BookRow = typeof booksTable.$inferSelect;
export type NewBookRow = typeof booksTable.$inferInsert;
