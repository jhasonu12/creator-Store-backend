import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PublicService } from './public.service';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';

export class PublicController {
  private publicService = new PublicService();

  // ========== PUBLIC STORE ENDPOINTS ==========

  /**
   * Get public store by slug
   * @route GET /public/store/:slug
   * @param slug - Store slug identifier
   * @returns Store data with products, sections, pages, and theme
   */
  getStoreBySlug = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;

      if (!slug) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Store slug is required');
      }

      const store = await this.publicService.getStoreBySlug(slug);

      sendResponse(res, StatusCodes.OK, 'Store data retrieved successfully', store);
    } catch (error) {
      console.error('Error in getStoreBySlug:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });
}
