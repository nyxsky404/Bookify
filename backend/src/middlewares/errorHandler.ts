import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  if (typeof err === 'object' && err !== null && 'statusCode' in err) {
    const e = err as { statusCode: number; message: string };
    res.status(e.statusCode).json({ success: false, message: e.message });
    return;
  }
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
