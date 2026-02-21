import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@common/utils/logger';
import { AppError } from '@common/utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let details = null;

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || 'An error occurred';
    details = err.details;
  } else {
    message = err.message || 'Internal Server Error';
  }

  logger.error('Error caught by error handler:', {
    message,
    status: statusCode,
    path: req.path,
    method: req.method,
    details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details,
  });
};
