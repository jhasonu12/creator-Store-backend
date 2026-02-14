import { Request, Response, NextFunction } from 'express';
import { AppError } from '@common/utils/response';

export interface RoleRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role?: string;
  };
}

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: RoleRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role || '')) {
        throw new AppError(403, 'Insufficient permissions to access this resource');
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          statusCode: error.statusCode,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Authorization check failed',
      });
    }
  };
};
