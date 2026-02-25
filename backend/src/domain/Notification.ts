import { NotificationType } from './enums';

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public isRead: boolean,
    public readonly createdAt: Date,
  ) {}

  markAsRead(): void {
    this.isRead = true;
  }
}
