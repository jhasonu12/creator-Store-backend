import { Request, Response, NextFunction } from 'express';
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
        throw new AppError(401, 'User not authenticated');
      }

      const store = await this.storeBuilderService.getOrCreateStore(creatorId);

      sendResponse(res, 200, 'Store retrieved successfully', store);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  updateStore = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const store = await this.storeBuilderService.updateStore(id, req.body);

      sendResponse(res, 200, 'Store updated successfully', store);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  // ========== SECTION ENDPOINTS ==========

  createSection = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const section = await this.storeBuilderService.createSection(storeId, req.body);

      sendResponse(res, 201, 'Section created successfully', section);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  updateSection = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const section = await this.storeBuilderService.updateSection(id, req.body);

      sendResponse(res, 200, 'Section updated successfully', section);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  deleteSection = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.storeBuilderService.deleteSection(id);

      sendResponse(res, 200, 'Section deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  reorderSections = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const sections = await this.storeBuilderService.reorderSections(storeId, req.body.sections);

      sendResponse(res, 200, 'Sections reordered successfully', sections);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  getSections = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const sections = await this.storeBuilderService.getSections(storeId);

      sendResponse(res, 200, 'Sections retrieved successfully', sections);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  // ========== PAGE ENDPOINTS ==========

  createPage = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const page = await this.storeBuilderService.createPage(storeId, req.body);

      sendResponse(res, 201, 'Page created successfully', page);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  updatePage = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const page = await this.storeBuilderService.updatePage(id, req.body);

      sendResponse(res, 200, 'Page updated successfully', page);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  deletePage = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.storeBuilderService.deletePage(id);

      sendResponse(res, 200, 'Page deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  reorderPages = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const pages = await this.storeBuilderService.reorderPages(storeId, req.body.pages);

      sendResponse(res, 200, 'Pages reordered successfully', pages);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  getPages = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const pages = await this.storeBuilderService.getPages(storeId);

      sendResponse(res, 200, 'Pages retrieved successfully', pages);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  // ========== BLOCK ENDPOINTS ==========

  createBlock = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { pageId } = req.params;
      const block = await this.storeBuilderService.createBlock(pageId, req.body);

      sendResponse(res, 201, 'Block created successfully', block);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  updateBlock = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const block = await this.storeBuilderService.updateBlock(id, req.body);

      sendResponse(res, 200, 'Block updated successfully', block);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  deleteBlock = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.storeBuilderService.deleteBlock(id);

      sendResponse(res, 200, 'Block deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  reorderBlocks = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { pageId } = req.params;
      const blocks = await this.storeBuilderService.reorderBlocks(pageId, req.body.blocks);

      sendResponse(res, 200, 'Blocks reordered successfully', blocks);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  getBlocks = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { pageId } = req.params;
      const blocks = await this.storeBuilderService.getBlocks(pageId);

      sendResponse(res, 200, 'Blocks retrieved successfully', blocks);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  // ========== THEME ENDPOINTS ==========

  getTheme = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const theme = await this.storeBuilderService.getTheme(storeId);

      sendResponse(res, 200, 'Theme retrieved successfully', theme);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });

  updateTheme = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.params;
      const theme = await this.storeBuilderService.updateTheme(storeId, req.body.config);

      sendResponse(res, 200, 'Theme updated successfully', theme);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Internal server error');
    }
  });
}
