import { decimal, integer, jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export const salesReportsTable = pgTable('sales_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }).notNull(),
  totalOrders: integer('total_orders').notNull(),
  booksSold: integer('books_sold').notNull(),
  topSellingBooks: jsonb('top_selling_books'),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

export type SalesReportRow = typeof salesReportsTable.$inferSelect;
export type NewSalesReportRow = typeof salesReportsTable.$inferInsert;
