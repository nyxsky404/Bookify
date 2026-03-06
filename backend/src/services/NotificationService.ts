import { Notification } from '../domain/Notification';
import { NotificationType } from '../domain/enums';
import { INotificationObserver, NotificationEvent } from '../patterns/observer/NotificationObserver';
import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';
import { ApiError } from '../utils/apiError';

export class NotificationService {
  private observers: INotificationObserver[] = [];

  constructor(private readonly notificationRepo: INotificationRepository) {}

  subscribe(observer: INotificationObserver): void {
    this.observers.push(observer);
  }

  async notify(event: NotificationEvent): Promise<void> {
    await Promise.all(this.observers.map(o => o.onEvent(event)));
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepo.findByUserId(userId);
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) throw ApiError.notFound('Notification not found');
    if (notification.userId !== userId) throw ApiError.forbidden();
    await this.notificationRepo.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
  }

  async sendOrderPlaced(userId: string, orderNumber: string): Promise<void> {
    await this.notify({
      type: NotificationType.ORDER_PLACED,
      userId,
      title: 'Order Placed',
      message: `Your order ${orderNumber} has been placed successfully.`,
    });
  }

  async sendOrderStatusUpdate(userId: string, orderNumber: string, status: string): Promise<void> {
    const typeMap: Record<string, NotificationType> = {
      SHIPPED: NotificationType.ORDER_SHIPPED,
      DELIVERED: NotificationType.ORDER_DELIVERED,
      CANCELLED: NotificationType.ORDER_CANCELLED,
    };
    const type = typeMap[status];
    if (!type) return;
    await this.notify({
      type,
      userId,
      title: `Order ${status.charAt(0) + status.slice(1).toLowerCase()}`,
      message: `Your order ${orderNumber} has been ${status.toLowerCase()}.`,
    });
  }

  async sendLowStockAlert(adminUserId: string, bookTitle: string, stock: number): Promise<void> {
    await this.notify({
      type: NotificationType.LOW_STOCK_ALERT,
      userId: adminUserId,
      title: 'Low Stock Alert',
      message: `"${bookTitle}" is low on stock (${stock} remaining).`,
    });
  }
}
