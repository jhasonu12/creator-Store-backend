import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from './product.service';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';
import { ProductType, ProductStatus } from '@models/Product';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class ProductController {
  private productService = new ProductService();

  /**
   * GET /api/v1/products
   * Get all products for the authenticated creator
   */
  getProducts = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      if (!creatorId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const products = await this.productService.getProducts(creatorId);
      sendResponse(res, StatusCodes.OK, 'Products retrieved successfully', products);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  /**
   * GET /api/v1/products/:id
   * Get a single product
   */
  getProduct = asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProduct(id);

      sendResponse(res, StatusCodes.OK, 'Product retrieved successfully', product);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  /**
   * POST /api/v1/products
   * Create a new product
   */
  createProduct = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const product = await this.productService.createProduct(userId, req.body);
      sendResponse(res, StatusCodes.CREATED, 'Product created successfully', product);
    } catch (error) {
      console.error('Error in createProduct:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  /**
   * PATCH /api/v1/products/:id
   * Update a product
   */
  updateProduct = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      if (!creatorId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const { id } = req.params;
      const product = await this.productService.updateProduct(id, creatorId, req.body);

      sendResponse(res, StatusCodes.OK, 'Product updated successfully', product);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  /**
   * DELETE /api/v1/products/:id
   * Delete a product
   */
  deleteProduct = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      if (!creatorId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const { id } = req.params;
      await this.productService.deleteProduct(id, creatorId);

      sendResponse(res, StatusCodes.OK, 'Product deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  /**
   * PATCH /api/v1/products/:id/status
   * Update product status
   */
  updateStatus = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const { id } = req.params;
      const { status } = req.body;
      const product = await this.productService.updateStatus(id, userId, status);

      sendResponse(res, StatusCodes.OK, `Product status updated to ${status}`, product);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });

  /**
   * PATCH /api/v1/products/reorder
   * Reorder products
   */
  reorderProducts = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const { products } = req.body;
      const reorderedProducts = await this.productService.reorderProducts(userId, products);

      sendResponse(res, StatusCodes.OK, 'Products reordered successfully', reorderedProducts);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
  });
}
