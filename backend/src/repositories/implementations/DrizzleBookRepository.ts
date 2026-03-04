import { and, asc, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { getDb } from '../../config/database';
import { booksTable, orderItemsTable } from '../../db/schema';
import { Book } from '../../domain/Book';
import { BookFiltersDto } from '../../dto/book.dto';
import { IBookRepository, PaginatedResult } from '../interfaces/IBookRepository';

function rowToBook(row: typeof booksTable.$inferSelect): Book {
  return new Book(
    row.id, row.title, row.author, row.isbn ?? null,
    row.description ?? null, parseFloat(row.price),
    row.stockQuantity, row.categoryId ?? null,
    row.imageUrl ?? null, row.publishedYear ?? null,
    row.publisher ?? null, row.createdAt, row.updatedAt,
  );
}

export class DrizzleBookRepository implements IBookRepository {
  private get db() { return getDb(); }

  async findById(id: string): Promise<Book | null> {
    const rows = await this.db.select().from(booksTable).where(eq(booksTable.id, id)).limit(1);
    return rows[0] ? rowToBook(rows[0]) : null;
  }

  async findAll(filters: BookFiltersDto): Promise<PaginatedResult<Book>> {
    const conditions = [];
    if (filters.categoryId) conditions.push(eq(booksTable.categoryId, filters.categoryId));
    if (filters.minPrice) conditions.push(gte(booksTable.price, String(filters.minPrice)));
    if (filters.maxPrice) conditions.push(lte(booksTable.price, String(filters.maxPrice)));
    if (filters.publishedYear) conditions.push(eq(booksTable.publishedYear, filters.publishedYear));
    if (filters.inStock) conditions.push(gte(booksTable.stockQuantity, 1));
    if (filters.search) {
      conditions.push(or(
        ilike(booksTable.title, `%${filters.search}%`),
        ilike(booksTable.author, `%${filters.search}%`),
        ilike(booksTable.isbn, `%${filters.search}%`),
      ));
    }
    if (filters.author) conditions.push(ilike(booksTable.author, `%${filters.author}%`));

    const where = conditions.length ? and(...conditions) : undefined;
    const orderBy = filters.sortBy === 'price_asc' ? asc(booksTable.price)
      : filters.sortBy === 'price_desc' ? desc(booksTable.price)
      : filters.sortBy === 'title' ? asc(booksTable.title)
      : desc(booksTable.createdAt);

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      this.db.select().from(booksTable).where(where).orderBy(orderBy).limit(limit).offset(offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(booksTable).where(where),
    ]);

    const total = countResult[0]?.count ?? 0;
    return { data: rows.map(rowToBook), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByCategory(categoryId: string): Promise<Book[]> {
    const rows = await this.db.select().from(booksTable).where(eq(booksTable.categoryId, categoryId));
    return rows.map(rowToBook);
  }

  async search(query: string): Promise<Book[]> {
    const rows = await this.db.select().from(booksTable).where(
      or(ilike(booksTable.title, `%${query}%`), ilike(booksTable.author, `%${query}%`), ilike(booksTable.isbn, `%${query}%`))
    ).limit(20);
    return rows.map(rowToBook);
  }

  async save(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const rows = await this.db.insert(booksTable).values({
      title: data.title, author: data.author, isbn: data.isbn ?? undefined,
      description: data.description ?? undefined, price: String(data.price),
      stockQuantity: data.stockQuantity, categoryId: data.categoryId ?? undefined,
      imageUrl: data.imageUrl ?? undefined, publishedYear: data.publishedYear ?? undefined,
      publisher: data.publisher ?? undefined,
    }).returning();
    return rowToBook(rows[0]);
  }

  async update(id: string, data: Partial<Omit<Book, 'id' | 'createdAt'>>): Promise<Book> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.isbn !== undefined) updateData.isbn = data.isbn;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.publishedYear !== undefined) updateData.publishedYear = data.publishedYear;
    if (data.publisher !== undefined) updateData.publisher = data.publisher;
    const rows = await this.db.update(booksTable).set(updateData).where(eq(booksTable.id, id)).returning();
    if (!rows[0]) throw new Error('Book not found');
    return rowToBook(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(booksTable).where(eq(booksTable.id, id));
  }

  async findLowStock(threshold: number): Promise<Book[]> {
    const rows = await this.db.select().from(booksTable)
      .where(and(gte(booksTable.stockQuantity, 1), lte(booksTable.stockQuantity, threshold)));
    return rows.map(rowToBook);
  }

  async findTopSelling(limit: number): Promise<Array<Book & { totalSold: number }>> {
    const rows = await this.db
      .select({ book: booksTable, totalSold: sql<number>`sum(${orderItemsTable.quantity})::int` })
      .from(orderItemsTable)
      .innerJoin(booksTable, eq(orderItemsTable.bookId, booksTable.id))
      .groupBy(booksTable.id)
      .orderBy(desc(sql`sum(${orderItemsTable.quantity})`))
      .limit(limit);
    return rows.map(r => Object.assign(rowToBook(r.book), { totalSold: r.totalSold ?? 0 }));
  }
}
