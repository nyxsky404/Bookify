import { eq } from 'drizzle-orm';
import { getDb } from '../../config/database';
import { notificationsTable } from '../../db/schema';
import { Notification } from '../../domain/Notification';
import { NotificationType } from '../../domain/enums';
import { INotificationRepository } from '../interfaces/INotificationRepository';

function rowToNotification(row: typeof notificationsTable.$inferSelect): Notification {
  return new Notification(row.id, row.userId, row.type as NotificationType, row.title, row.message, row.isRead, row.createdAt);
}

export class DrizzleNotificationRepository implements INotificationRepository {
  private get db() { return getDb(); }

  async findByUserId(userId: string): Promise<Notification[]> {
    const rows = await this.db.select().from(notificationsTable).where(eq(notificationsTable.userId, userId))
      .orderBy(notificationsTable.createdAt);
    return rows.map(rowToNotification);
  }

  async findById(id: string): Promise<Notification | null> {
    const rows = await this.db.select().from(notificationsTable).where(eq(notificationsTable.id, id)).limit(1);
    return rows[0] ? rowToNotification(rows[0]) : null;
  }

  async save(data: { userId: string; type: NotificationType; title: string; message: string }): Promise<Notification> {
    const rows = await this.db.insert(notificationsTable).values(data).returning();
    return rowToNotification(rows[0]);
  }

  async markAsRead(id: string): Promise<void> {
    await this.db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, id));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.userId, userId));
  }
}
