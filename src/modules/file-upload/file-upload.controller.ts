import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse, AppError, asyncHandler } from '@common/utils/response';
import fileUploadService from './file-upload.service';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export class FileUploadController {
  /**
   * POST /api/v1/files/presigned-url
   * Get a presigned URL for uploading a file directly to S3
   * Creates a PENDING ProductFile record for tracking
   * Automatically uses authenticated user's ID
   *
   * Body:
   *   - originalFilename: string (required)
   *   - contentType: string (required)
   *   - productId: string (required for product files, optional for profile/document)
   *   - entityType: string (optional - 'product', 'profile', 'document'. defaults to 'profile')
   *   - folder: string (optional - S3 folder path)
   *   - expiresIn: number (optional - URL expiry in seconds)
   */
  getPresignedUrl = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
        }

        const { originalFilename, contentType, folder, expiresIn, productId, entityType } = req.body;

        if (!originalFilename || !contentType) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'originalFilename and contentType are required'
          );
        }

        const result = await fileUploadService.generatePresignedUploadUrl({
          originalFilename,
          contentType,
          folder,
          expiresIn,
          productId,
          userId, // From auth token
          entityType,
        });

        sendResponse(
          res,
          StatusCodes.OK,
          'Presigned URL generated successfully',
          result
        );
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        console.error('Error in getPresignedUrl:', error);
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to generate presigned URL'
        );
      }
    }
  );

  /**
   * POST /api/v1/files/register
   * Register a file that was uploaded to S3
   * Updates the PENDING file record to UPLOADED status
   * Call this after successfully uploading file using presigned URL
   */
  registerFile = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
        }

        const { fileId, s3Key, fileSize } = req.body;

        if (!fileId || !s3Key || !fileSize) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'fileId, s3Key, and fileSize are required'
          );
        }

        const productFile = await fileUploadService.registerProductFile({
          fileId,
          s3Key,
          fileSize,
        });

        sendResponse(
          res,
          StatusCodes.OK,
          'File registered successfully',
          productFile
        );
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        console.error('Error in registerFile:', error);
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to register file'
        );
      }
    }
  );

  /**
   * GET /api/v1/files/products/:productId
   * Get all files for a product
   */
  getProductFiles = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { productId } = req.params;

        const files = await fileUploadService.getProductFiles(productId);

        sendResponse(
          res,
          StatusCodes.OK,
          'Product files retrieved successfully',
          files
        );
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        console.error('Error in getProductFiles:', error);
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to retrieve files'
        );
      }
    }
  );

  /**
   * GET /api/v1/files/:fileId
   * Get file info
   */
  getFileInfo = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { fileId } = req.params;

        const file = await fileUploadService.getFileInfo(fileId);
        if (!file) {
          throw new AppError(StatusCodes.NOT_FOUND, 'File not found');
        }

        sendResponse(
          res,
          StatusCodes.OK,
          'File info retrieved successfully',
          file
        );
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        console.error('Error in getFileInfo:', error);
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to retrieve file info'
        );
      }
    }
  );

  /**
   * GET /api/v1/files/:fileId/download
   * Get a signed download URL for a file
   */
  getDownloadUrl = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const { fileId } = req.params;
        const { expiresIn } = req.query as { expiresIn?: string };

        const downloadUrl = await fileUploadService.getDownloadUrl({
          fileId,
          expiresIn: expiresIn ? parseInt(expiresIn, 10) : 3600,
        });

        sendResponse(
          res,
          StatusCodes.OK,
          'Download URL generated successfully',
          {
            downloadUrl,
          }
        );
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        console.error('Error in getDownloadUrl:', error);
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to generate download URL'
        );
      }
    }
  );

  /**
   * DELETE /api/v1/files/:fileId
   * Delete a file
   */
  deleteFile = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
        }

        const { fileId } = req.params;

        await fileUploadService.deleteProductFile(fileId, userId);

        sendResponse(res, StatusCodes.OK, 'File deleted successfully');
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        console.error('Error in deleteFile:', error);
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to delete file'
        );
      }
    }
  );
}

export default new FileUploadController();
