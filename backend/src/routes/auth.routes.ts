import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate';
import { LoginDtoSchema, RegisterDtoSchema } from '../dto/auth.dto';

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post('/register', validate(RegisterDtoSchema), authController.register);
  router.post('/login', validate(LoginDtoSchema), authController.login);

  return router;
}
