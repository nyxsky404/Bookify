import { Notification } from '../../domain/Notification';
import { NotificationType } from '../../domain/enums';

export interface INotificationRepository {
  findByUserId(userId: string): Promise<Notification[]>;
  findById(id: string): Promise<Notification | null>;
  save(data: { userId: string; type: NotificationType; title: string; message: string }): Promise<Notification>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
