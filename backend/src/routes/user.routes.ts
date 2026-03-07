import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { ChangePasswordDtoSchema, UpdateProfileDtoSchema } from '../dto/auth.dto';

export function createUserRouter(userController: UserController): Router {
  const router = Router();

  router.use(authenticate);
  router.get('/me', userController.getProfile);
  router.patch('/me', validate(UpdateProfileDtoSchema), userController.updateProfile);
  router.patch('/me/password', validate(ChangePasswordDtoSchema), userController.changePassword);

  return router;
}
