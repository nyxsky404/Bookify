import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, token } = await this.authService.register(req.body);
      res.status(201).json({ success: true, data: { user: user.toPublic(), token } });
    } catch (err) { next(err); }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, token } = await this.authService.login(req.body);
      res.json({ success: true, data: { user: user.toPublic(), token } });
    } catch (err) { next(err); }
  };
}
