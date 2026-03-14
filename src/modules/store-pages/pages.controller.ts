import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';
import { StorePageService } from './pages.service';

export class StorePageController {
  private storePageService = new StorePageService();

  // ========== PAGE ENDPOINTS ==========

  updatePage = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const page = await this.storePageService.updatePage(id, req.body);

      sendResponse(res, StatusCodes.OK, 'Page updated successfully', page);
    } catch (error) {
      console.error('Error in updatePage:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  // ========== BLOCK ENDPOINTS ==========

  createBlock = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { pageId } = req.params;
      const block = await this.storePageService.createBlock(pageId, req.body);

      sendResponse(res, StatusCodes.CREATED, 'Block created successfully', block);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  updateBlock = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const block = await this.storePageService.updateBlock(id, req.body);

      sendResponse(res, StatusCodes.OK, 'Block updated successfully', block);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  deleteBlock = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.storePageService.deleteBlock(id);

      sendResponse(res, StatusCodes.OK, 'Block deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  reorderBlocks = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { pageId } = req.params;
      const blocks = await this.storePageService.reorderBlocks(pageId, req.body.blocks);

      sendResponse(res, StatusCodes.OK, 'Blocks reordered successfully', blocks);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  getBlocks = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { pageId } = req.params;
      const blocks = await this.storePageService.getBlocks(pageId);

      sendResponse(res, StatusCodes.OK, 'Blocks retrieved successfully', blocks);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });
}
