import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StoreSlugService } from './store-slug.service';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';

export class StoreSlugController {
  private storeSlugService = new StoreSlugService();

  checkSlugAvailability = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.query as { slug: string };

      const result = await this.storeSlugService.checkSlugAvailability(slug);

      sendResponse(res, StatusCodes.OK, result.message, {
        available: result.available,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });
}
