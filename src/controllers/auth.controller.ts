import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@services/auth.service';
import { CreateUserDTO, LoginDTO } from '@dto/user.dto';
import { sendResponse, AppError, asyncHandler } from '@utils/errorHandler';
import { RESPONSE_MESSAGES } from '@constants/messages';

export class AuthController {
  private authService = new AuthService();

  register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateUserDTO = req.body;
      const result = await this.authService.register(dto);

      sendResponse(res, 201, RESPONSE_MESSAGES.SIGNUP_SUCCESS, result);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);

      sendResponse(res, 200, RESPONSE_MESSAGES.LOGIN_SUCCESS, result);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  logout = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      await this.authService.logout(userId);

      sendResponse(res, 200, RESPONSE_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });
}
