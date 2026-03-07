import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { CreateCategoryDtoSchema, UpdateCategoryDtoSchema } from '../dto/category.dto';
import { UserRole } from '../domain/enums';

export function createCategoryRouter(categoryController: CategoryController): Router {
  const router = Router();

  router.get('/', categoryController.getAll);
  router.get('/:id', categoryController.getById);

  router.post('/', authenticate, authorize(UserRole.ADMIN), validate(CreateCategoryDtoSchema), categoryController.create);
  router.patch('/:id', authenticate, authorize(UserRole.ADMIN), validate(UpdateCategoryDtoSchema), categoryController.update);
  router.delete('/:id', authenticate, authorize(UserRole.ADMIN), categoryController.delete);

  return router;
}
