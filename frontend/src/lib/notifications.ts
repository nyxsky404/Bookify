import { apiClient } from "./api";

export interface Notification {
  id: string;
  userId: string;
  type: "ORDER_PLACED" | "ORDER_SHIPPED" | "ORDER_DELIVERED" | "ORDER_CANCELLED" | "LOW_STOCK_ALERT";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export class NotificationService {
  async getMyNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>("/notifications");
  }

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  }
}

export const notificationService = new NotificationService();
