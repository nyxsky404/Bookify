import { eq } from 'drizzle-orm';
import { getDb } from '../../config/database';
import { usersTable } from '../../db/schema';
import { User } from '../../domain/User';
import { UserRole } from '../../domain/enums';
import { IUserRepository } from '../interfaces/IUserRepository';

function rowToUser(row: typeof usersTable.$inferSelect): User {
  return new User(
    row.id,
    row.email,
    row.passwordHash,
    row.name,
    row.role as UserRole,
    row.address ?? null,
    row.phone ?? null,
    row.createdAt,
    row.updatedAt,
  );
}

export class DrizzleUserRepository implements IUserRepository {
  private get db() {
    return getDb();
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  async save(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const rows = await this.db
      .insert(usersTable)
      .values({
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role,
        address: data.address ?? undefined,
        phone: data.phone ?? undefined,
      })
      .returning();
    return rowToUser(rows[0]);
  }

  async update(id: string, data: Partial<Pick<User, 'name' | 'address' | 'phone' | 'passwordHash' | 'updatedAt'>>): Promise<User> {
    const rows = await this.db
      .update(usersTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning();
    if (!rows[0]) throw new Error('User not found');
    return rowToUser(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(usersTable).where(eq(usersTable.id, id));
  }
}
