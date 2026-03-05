import { NotificationType } from '../../domain/enums';

export interface NotificationEvent {
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
}

export interface INotificationObserver {
  onEvent(event: NotificationEvent): Promise<void>;
}

export class InAppNotificationObserver implements INotificationObserver {
  constructor(
    private readonly saveNotification: (data: {
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
    }) => Promise<void>,
  ) {}

  async onEvent(event: NotificationEvent): Promise<void> {
    await this.saveNotification({
      userId: event.userId,
      type: event.type,
      title: event.title,
      message: event.message,
    });
  }
}

export class EmailNotificationObserver implements INotificationObserver {
  async onEvent(event: NotificationEvent): Promise<void> {
    console.log(`[EMAIL STUB] To user ${event.userId}: ${event.title} — ${event.message}`);
  }
}
