import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { UpdateUserDTO } from '@dto/user.dto';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';
import { RESPONSE_MESSAGES } from '@constants/messages';

interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export class UserController {
  private userService = new UserService();

  getProfile = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const user = await this.userService.getUserById(userId);

      sendResponse(res, 200, RESPONSE_MESSAGES.SUCCESS, user);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);

      sendResponse(res, 200, RESPONSE_MESSAGES.SUCCESS, user);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  updateProfile = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const dto: UpdateUserDTO = req.body;
      const updated = await this.userService.updateUser(userId, dto);

      sendResponse(res, 200, RESPONSE_MESSAGES.UPDATED, updated);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  deleteProfile = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.userService.deleteUser(userId);

      sendResponse(res, 200, RESPONSE_MESSAGES.DELETED);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.userService.getAllUsers(page, limit);

      sendResponse(res, 200, RESPONSE_MESSAGES.SUCCESS, result.users, result.meta);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });
}
