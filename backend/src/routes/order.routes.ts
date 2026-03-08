import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { CreateOrderDtoSchema, UpdateOrderStatusDtoSchema } from '../dto/order.dto';
import { UserRole } from '../domain/enums';

export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();

  router.use(authenticate);

  router.post('/', validate(CreateOrderDtoSchema), orderController.createOrder);
  router.get('/my', orderController.getMyOrders);
  router.get('/:id', orderController.getOrderById);
  router.post('/:id/cancel', orderController.cancelOrder);

  router.get('/', authorize(UserRole.ADMIN), orderController.getAllOrders);
  router.patch('/:id/status', authorize(UserRole.ADMIN), validate(UpdateOrderStatusDtoSchema), orderController.updateStatus);

  return router;
}
