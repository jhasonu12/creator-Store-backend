import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginDTO } from '@dto/user.dto';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';
import { RESPONSE_MESSAGES } from '@constants/messages';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class AuthController {
  private authService = new AuthService();

  signup = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateUserDTO = req.body;
      const result = await this.authService.signup(dto);

      sendResponse(res, 201, RESPONSE_MESSAGES.SIGNUP_SUCCESS, result);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  signupAsCreator = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, username, password, slug, fullName, timezone, countryCode } = req.body;
      const result = await this.authService.signupAsCreator({
        email,
        username,
        password,
        slug,
        fullName,
        timezone,
        countryCode,
      });

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

  refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError(400, 'Refresh token is required');
      }

      const result = await this.authService.refreshToken(refreshToken);
      sendResponse(res, 200, 'Token refreshed successfully', result);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

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
