import cors from 'cors';
import express from 'express';
import { initDb } from './config/database';
import { AnalyticsController } from './controllers/AnalyticsController';
import { AuthController } from './controllers/AuthController';
import { BookController } from './controllers/BookController';
import { CartController } from './controllers/CartController';
import { CategoryController } from './controllers/CategoryController';
import { NotificationController } from './controllers/NotificationController';
import { OrderController } from './controllers/OrderController';
import { UserController } from './controllers/UserController';
import { errorHandler } from './middlewares/errorHandler';
import { InAppNotificationObserver } from './patterns/observer/NotificationObserver';
import { DrizzleBookRepository } from './repositories/implementations/DrizzleBookRepository';
import { DrizzleCartRepository } from './repositories/implementations/DrizzleCartRepository';
import { DrizzleCategoryRepository } from './repositories/implementations/DrizzleCategoryRepository';
import { DrizzleNotificationRepository } from './repositories/implementations/DrizzleNotificationRepository';
import { DrizzleOrderRepository } from './repositories/implementations/DrizzleOrderRepository';
import { DrizzleUserRepository } from './repositories/implementations/DrizzleUserRepository';
import { createAnalyticsRouter } from './routes/analytics.routes';
import { createAuthRouter } from './routes/auth.routes';
import { createBookRouter } from './routes/book.routes';
import { createCartRouter } from './routes/cart.routes';
import { createCategoryRouter } from './routes/category.routes';
import { createNotificationRouter } from './routes/notification.routes';
import { createOrderRouter } from './routes/order.routes';
import { createUserRouter } from './routes/user.routes';
import { AnalyticsService } from './services/AnalyticsService';
import { AuthService } from './services/AuthService';
import { CartService } from './services/CartService';
import { CategoryService } from './services/CategoryService';
import { InventoryService } from './services/InventoryService';
import { NotificationService } from './services/NotificationService';
import { OrderService } from './services/OrderService';
import { ProductService } from './services/ProductService';

export function createApp() {
  initDb();

  const userRepo = new DrizzleUserRepository();
  const bookRepo = new DrizzleBookRepository();
  const categoryRepo = new DrizzleCategoryRepository();
  const cartRepo = new DrizzleCartRepository();
  const orderRepo = new DrizzleOrderRepository();
  const notificationRepo = new DrizzleNotificationRepository();

  const notificationService = new NotificationService(notificationRepo);
  notificationService.subscribe(
    new InAppNotificationObserver(async (data) => { await notificationRepo.save(data); }),
  );

  const authService = new AuthService(userRepo);
  const categoryService = new CategoryService(categoryRepo);
  const productService = new ProductService(bookRepo, categoryRepo);
  const cartService = new CartService(cartRepo, bookRepo);
  const inventoryService = new InventoryService(bookRepo);
  const orderService = new OrderService(orderRepo, cartRepo, bookRepo, inventoryService, notificationService);
  const analyticsService = new AnalyticsService(orderRepo, bookRepo);

  const authController = new AuthController(authService);
  const userController = new UserController(authService);
  const bookController = new BookController(productService);
  const categoryController = new CategoryController(categoryService);
  const cartController = new CartController(cartService);
  const orderController = new OrderController(orderService);
  const notificationController = new NotificationController(notificationService);
  const analyticsController = new AnalyticsController(analyticsService, inventoryService);

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api/users', createUserRouter(userController));
  app.use('/api/books', createBookRouter(bookController));
  app.use('/api/categories', createCategoryRouter(categoryController));
  app.use('/api/cart', createCartRouter(cartController));
  app.use('/api/orders', createOrderRouter(orderController));
  app.use('/api/notifications', createNotificationRouter(notificationController));
  app.use('/api/analytics', createAnalyticsRouter(analyticsController));

  app.use(errorHandler);

  return app;
}
