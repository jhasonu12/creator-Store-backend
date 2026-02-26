import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreatorProfile } from '@models/CreatorProfile';
import { Store } from '@models/Store';
import { StoreSection } from '@models/StoreSection';
import { StorePage } from '@models/StorePage';
import { PageBlock } from '@models/PageBlock';
import { StoreTheme } from '@models/StoreTheme';
import { Product } from '@models/Product';
import { StoreBuilderService } from './store-builder.service';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class StoreBuilderController {
  private storeBuilderService = new StoreBuilderService();

  // ========== STORE ENDPOINTS ==========

  getStore = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      // Get creator profile to access creatorId
      const creatorProfile = await CreatorProfile.findOne({ where: { userId } });
      if (!creatorProfile) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Creator profile not found. Please sign up as a creator.');
      }

      // Get store with all related data including creator profile
      const store = await Store.findOne({
        where: { creatorId: creatorProfile.id },
        include: [
          {
            model: CreatorProfile,
            as: 'creatorProfile',
            attributes: ['id', 'fullName', 'profileImage', 'bio', 'socials'],
          },
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'type', 'title', 'description', 'price', 'currency', 'thumbnailUrl', 'status', 'position', 'createdAt', 'updatedAt'],
            order: [['position', 'ASC']],
          },
          {
            model: StoreSection,
            as: 'sections',
            attributes: ['id', 'type', 'position', 'status', 'data', 'createdAt', 'updatedAt'],
            order: [['position', 'ASC']],
          },
          {
            model: StorePage,
            as: 'pages',
            attributes: ['id', 'slug', 'type', 'position', 'status', 'data', 'createdAt', 'updatedAt'],
            order: [['position', 'ASC']],
            include: [
              {
                model: PageBlock,
                as: 'blocks',
                attributes: ['id', 'type', 'position', 'data', 'createdAt', 'updatedAt'],
                order: [['position', 'ASC']],
              },
            ],
          },
          {
            model: StoreTheme,
            as: 'theme',
            attributes: ['id', 'config', 'updatedAt'],
          },
        ],
      });

      if (!store) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Store not found. Store is created during creator signup.');
      }

      // Return store data with nested creator profile and products
      sendResponse(res, StatusCodes.OK, 'Store data retrieved successfully', store.toJSON());
    } catch (error) {
      console.error('Error in getStore:', error);
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
      console.error('Error in createSection:', error);
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
      console.error('Error in createPage:', error);
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
      console.error('Error in getTheme:', error);
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
