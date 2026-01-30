import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error caught by error handler:', {
    message: err.message,
    status: err.statusCode || 500,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
