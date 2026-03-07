import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { CreateBookDtoSchema, UpdateBookDtoSchema } from '../dto/book.dto';
import { UserRole } from '../domain/enums';

export function createBookRouter(bookController: BookController): Router {
  const router = Router();

  router.get('/', bookController.getAll);
  router.get('/search', bookController.search);
  router.get('/:id', bookController.getById);

  router.post('/', authenticate, authorize(UserRole.ADMIN), validate(CreateBookDtoSchema), bookController.create);
  router.patch('/:id', authenticate, authorize(UserRole.ADMIN), validate(UpdateBookDtoSchema), bookController.update);
  router.delete('/:id', authenticate, authorize(UserRole.ADMIN), bookController.delete);

  return router;
}
