import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/authenticate';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notifications = await this.notificationService.getUserNotifications(req.user!.userId);
      res.json({ success: true, data: notifications });
    } catch (err) { next(err); }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.notificationService.markAsRead(req.params.id, req.user!.userId);
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (err) { next(err); }
  };

  markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.notificationService.markAllAsRead(req.user!.userId);
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) { next(err); }
  };
}
