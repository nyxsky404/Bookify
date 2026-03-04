import { eq } from 'drizzle-orm';
import { getDb } from '../../config/database';
import { categoriesTable } from '../../db/schema';
import { Category } from '../../domain/Category';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';

function rowToCategory(row: typeof categoriesTable.$inferSelect): Category {
  return new Category(row.id, row.name, row.description ?? null, row.slug, row.createdAt);
}

export class DrizzleCategoryRepository implements ICategoryRepository {
  private get db() { return getDb(); }

  async findById(id: string): Promise<Category | null> {
    const rows = await this.db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);
    return rows[0] ? rowToCategory(rows[0]) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const rows = await this.db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug)).limit(1);
    return rows[0] ? rowToCategory(rows[0]) : null;
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.db.select().from(categoriesTable).orderBy(categoriesTable.name);
    return rows.map(rowToCategory);
  }

  async save(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const rows = await this.db.insert(categoriesTable).values({
      name: data.name,
      description: data.description ?? undefined,
      slug: data.slug,
    }).returning();
    return rowToCategory(rows[0]);
  }

  async update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category> {
    const rows = await this.db.update(categoriesTable).set(data).where(eq(categoriesTable.id, id)).returning();
    if (!rows[0]) throw new Error('Category not found');
    return rowToCategory(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  }
}
