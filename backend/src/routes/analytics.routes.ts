import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { UserRole } from '../domain/enums';

export function createAnalyticsRouter(analyticsController: AnalyticsController): Router {
  const router = Router();

  router.use(authenticate, authorize(UserRole.ADMIN));
  router.get('/dashboard', analyticsController.getDashboard);
  router.get('/sales-report', analyticsController.getSalesReport);
  router.get('/top-books', analyticsController.getTopSellingBooks);
  router.get('/low-stock', analyticsController.getLowStockBooks);
  router.patch('/inventory/:bookId', analyticsController.updateStock);

  return router;
}
