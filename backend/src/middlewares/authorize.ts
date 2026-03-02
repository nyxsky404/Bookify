import { NextFunction, Response } from 'express';
import { UserRole } from '../domain/enums';
import { ApiError } from '../utils/apiError';
import { AuthRequest } from './authenticate';

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role as UserRole)) return next(ApiError.forbidden());
    next();
  };
}
