import { Response } from 'express';
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn: Function) => {
  return (...args: any[]) => Promise.resolve(fn(...args)).catch(args[2]);
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: any
): Response => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
    data: data || null,
    meta: meta || {},
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details?: any
): Response => {
  logger.error(message, details);
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: details || null,
  });
};

export const handleError = (error: any, res: Response): void => {
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message, error.details);
  } else {
    logger.error('Unhandled error:', error);
    sendError(res, 500, 'Internal Server Error');
  }
};
