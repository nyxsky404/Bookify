import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticate } from '../middlewares/authenticate';

export function createNotificationRouter(notificationController: NotificationController): Router {
  const router = Router();

  router.use(authenticate);
  router.get('/', notificationController.getMyNotifications);
  router.patch('/read-all', notificationController.markAllAsRead);
  router.patch('/:id/read', notificationController.markAsRead);

  return router;
}
