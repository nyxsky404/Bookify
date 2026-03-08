import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { AddToCartDtoSchema, UpdateCartItemDtoSchema } from '../dto/cart.dto';

export function createCartRouter(cartController: CartController): Router {
  const router = Router();

  router.use(authenticate);
  router.get('/', cartController.getCart);
  router.post('/items', validate(AddToCartDtoSchema), cartController.addItem);
  router.patch('/items/:itemId', validate(UpdateCartItemDtoSchema), cartController.updateItem);
  router.delete('/items/:itemId', cartController.removeItem);
  router.delete('/', cartController.clearCart);

  return router;
}
