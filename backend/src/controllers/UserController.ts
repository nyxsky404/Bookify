import { NextFunction, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../middlewares/authenticate';

export class UserController {
  constructor(private readonly authService: AuthService) {}

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.getProfile(req.user!.userId);
      res.json({ success: true, data: user.toPublic() });
    } catch (err) { next(err); }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, address, phone } = req.body;
      const user = await this.authService.updateProfile(req.user!.userId, name, address ?? null, phone ?? null);
      res.json({ success: true, data: user.toPublic() });
    } catch (err) { next(err); }
  };

  changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;
      await this.authService.changePassword(req.user!.userId, oldPassword, newPassword);
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) { next(err); }
  };
}
