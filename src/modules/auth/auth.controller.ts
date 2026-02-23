import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';
import { LoginDTO } from '@dto/user.dto';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';
import { RESPONSE_MESSAGES } from '@constants/messages';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class AuthController {
  private authService = new AuthService();

  signup = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { email, username, password } = req.body;
      const result = await this.authService.signup({
        email,
        username,
        password,
      });

      sendResponse(res, StatusCodes.CREATED, RESPONSE_MESSAGES.SIGNUP_SUCCESS, result);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  signupAsCreator = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
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

      sendResponse(res, StatusCodes.CREATED, RESPONSE_MESSAGES.SIGNUP_SUCCESS, result);
    } catch (error) {
      console.error('Error in signupAsCreator:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  login = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);

      sendResponse(res, StatusCodes.OK, RESPONSE_MESSAGES.LOGIN_SUCCESS, result);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  refreshToken = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Refresh token is required');
      }

      const result = await this.authService.refreshToken(refreshToken);
      sendResponse(res, StatusCodes.OK, 'Token refreshed successfully', result);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      await this.authService.logout(userId);

      sendResponse(res, StatusCodes.OK, RESPONSE_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });

  getMe = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const user = await this.authService.getCurrentUser(userId);

      sendResponse(res, StatusCodes.OK, 'User data retrieved successfully', user);
    } catch (error) {
      console.error('Error in getMe:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.INTERNAL_ERROR);
    }
  });
}
