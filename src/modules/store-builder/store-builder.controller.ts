import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StoreBuilderService } from './store-builder.service';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class StoreBuilderController {
  private storeBuilderService = new StoreBuilderService();

  // ========== STORE ENDPOINTS ==========

  getOrCreateStore = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      if (!creatorId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const store = await this.storeBuilderService.getOrCreateStore(creatorId);

      sendResponse(res, StatusCodes.OK, 'Store retrieved successfully', store);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  updateStore = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const store = await this.storeBuilderService.updateStore(id, req.body);

      sendResponse(res, StatusCodes.OK, 'Store updated successfully', store);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  // ========== SECTION ENDPOINTS ==========

  createSection = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const section = await this.storeBuilderService.createSection(storeId, req.body);

      sendResponse(res, StatusCodes.CREATED, 'Section created successfully', section);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  updateSection = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const section = await this.storeBuilderService.updateSection(id, req.body);

      sendResponse(res, StatusCodes.OK, 'Section updated successfully', section);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  deleteSection = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.storeBuilderService.deleteSection(id);

      sendResponse(res, StatusCodes.OK, 'Section deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  reorderSections = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const sections = await this.storeBuilderService.reorderSections(storeId, req.body.sections);

      sendResponse(res, StatusCodes.OK, 'Sections reordered successfully', sections);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  getSections = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const sections = await this.storeBuilderService.getSections(storeId);

      sendResponse(res, StatusCodes.OK, 'Sections retrieved successfully', sections);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  // ========== PAGE ENDPOINTS ==========

  createPage = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const page = await this.storeBuilderService.createPage(storeId, req.body);

      sendResponse(res, StatusCodes.CREATED, 'Page created successfully', page);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  updatePage = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const page = await this.storeBuilderService.updatePage(id, req.body);

      sendResponse(res, StatusCodes.OK, 'Page updated successfully', page);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  deletePage = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.storeBuilderService.deletePage(id);

      sendResponse(res, StatusCodes.OK, 'Page deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  reorderPages = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const pages = await this.storeBuilderService.reorderPages(storeId, req.body.pages);

      sendResponse(res, StatusCodes.OK, 'Pages reordered successfully', pages);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  getPages = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const pages = await this.storeBuilderService.getPages(storeId);

      sendResponse(res, StatusCodes.OK, 'Pages retrieved successfully', pages);
    } catch (error) {
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
      const block = await this.storeBuilderService.createBlock(pageId, req.body);

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
      const block = await this.storeBuilderService.updateBlock(id, req.body);

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
      await this.storeBuilderService.deleteBlock(id);

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
      const blocks = await this.storeBuilderService.reorderBlocks(pageId, req.body.blocks);

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
      const blocks = await this.storeBuilderService.getBlocks(pageId);

      sendResponse(res, StatusCodes.OK, 'Blocks retrieved successfully', blocks);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  // ========== THEME ENDPOINTS ==========

  getTheme = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const theme = await this.storeBuilderService.getTheme(storeId);

      sendResponse(res, StatusCodes.OK, 'Theme retrieved successfully', theme);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  updateTheme = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const theme = await this.storeBuilderService.updateTheme(storeId, req.body.config);

      sendResponse(res, StatusCodes.OK, 'Theme updated successfully', theme);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });
}
