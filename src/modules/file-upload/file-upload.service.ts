import { StatusCodes } from 'http-status-codes';
import { config } from '@config/environment';
import { AppError } from '@common/utils/response';
import { ProductFile, FileUploadStatus, FileEntityType } from '@models/ProductFile';
import { Product } from '@models/Product';
import s3Service from './s3.service';

export interface PresignedUrlRequest {
  originalFilename: string;
  contentType: string;
  folder?: string;
  expiresIn?: number;
  productId?: string;           // Required for product files
  userId: string;               // From auth token
  entityType?: FileEntityType;  // 'product', 'profile', or 'document' (defaults to 'profile')
}

export interface RegisterFileRequest {
  fileId: string; // Update existing PENDING record
  s3Key: string;
  fileSize: number;
}

export interface FileDownloadOptions {
  fileId: string;
  expiresIn?: number;
}

export class FileUploadService {
  /**
   * Validate file upload request
   */
  private validateFile(originalFilename: string, contentType: string): void {
    // Check file type
    const fileExtension = originalFilename.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = config.fileUpload.allowedFileTypes;

    if (!allowedExtensions.includes(fileExtension)) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `File type .${fileExtension} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`
      );
    }

    // Validate MIME type matches extension
    const validMimeTypes = this.getValidMimeTypes(fileExtension);
    if (!validMimeTypes.includes(contentType)) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `MIME type ${contentType} does not match file extension .${fileExtension}`
      );
    }
  }

  /**
   * Get valid MIME types for a file extension
   */
  private getValidMimeTypes(extension: string): string[] {
    const mimeTypeMap: { [key: string]: string[] } = {
      jpg: ['image/jpeg'],
      jpeg: ['image/jpeg'],
      png: ['image/png'],
      pdf: ['application/pdf'],
      doc: ['application/msword'],
      docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      txt: ['text/plain'],
      zip: ['application/zip'],
      mp4: ['video/mp4'],
      webm: ['video/webm'],
    };

    return mimeTypeMap[extension] || [];
  }

  /**
   * Generate a presigned URL for direct S3 upload
   * Creates a PENDING ProductFile record for tracking
   * Automatically associated with authenticated user
   * Can also be associated with a product for product files
   */
  async generatePresignedUploadUrl(options: PresignedUrlRequest): Promise<{
    fileId: string;
    presignedUrl: string;
    s3Key: string;
    bucket: string;
  }> {
    const {
      originalFilename,
      contentType,
      folder = 'assets',
      expiresIn = 3600,
      productId,
      userId,
      entityType = FileEntityType.PROFILE, // Default to profile for user files
    } = options;

    // Validate file
    this.validateFile(originalFilename, contentType);

    // Validate entityType matches the provided IDs
    if (entityType === FileEntityType.PRODUCT && !productId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'productId is required for product file uploads'
      );
    }

    try {
      // Validate product exists if productId provided
      if (productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
        }
      }

      // Generate S3 key
      const s3Key = s3Service.generateS3Key(folder, originalFilename);

      // Create PENDING file record for tracking
      const productFile = await ProductFile.create({
        productId: productId || undefined,
        userId, // Always set from token
        fileSize: 0, // Will be set on registration
        status: FileUploadStatus.PENDING,
        s3Key, // Store S3 key for reference
        entityType,
      });

      // Get presigned URL
      const presignedUrl = await s3Service.getPresignedUploadUrl({
        key: s3Key,
        contentType,
        expiresIn,
      });

      return {
        fileId: productFile.id,
        presignedUrl,
        s3Key,
        bucket: s3Service.getBucketName(),
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Presigned URL generation error:', error);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to generate presigned upload URL'
      );
    }
  }

  /**
   * Register a file that was uploaded to S3
   * Updates the PENDING file record to UPLOADED status
   * Call this after successfully uploading file to S3 using presigned URL
   */
  async registerProductFile(options: RegisterFileRequest): Promise<ProductFile> {
    const { fileId, s3Key, fileSize } = options;

    // Validate file size
    if (fileSize > config.fileUpload.maxFileSize) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `File size exceeds maximum limit of ${config.fileUpload.maxFileSize / 1024 / 1024}MB`
      );
    }

    try {
      // Get the PENDING file record
      const productFile = await ProductFile.findByPk(fileId);
      if (!productFile) {
        throw new AppError(StatusCodes.NOT_FOUND, 'File upload session not found');
      }

      // Verify it's still in PENDING status
      if (productFile.status !== FileUploadStatus.PENDING) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Cannot register file with status: ${productFile.status}`
        );
      }

      // Check if file exists in S3
      const fileExists = await s3Service.fileExists(s3Key);
      if (!fileExists) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'File not found in S3. Make sure file was uploaded successfully.'
        );
      }

      // Generate file URL
      const fileUrl = s3Service.getPublicUrl(s3Key);

      // Update the ProductFile record with S3 details and UPLOADED status
      await productFile.update({
        fileUrl,
        fileSize,
        status: FileUploadStatus.UPLOADED,
        s3Key,
      });

      return productFile;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('File registration error:', error);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to register file'
      );
    }
  }

  /**
   * Get product files
   */
  async getProductFiles(productId: string): Promise<ProductFile[]> {
    const files = await ProductFile.findAll({
      where: { productId },
      order: [['createdAt', 'DESC']],
    });

    return files;
  }

  /**
   * Generate a signed URL for downloading a private file
   */
  async getDownloadUrl(options: FileDownloadOptions): Promise<string> {
    const { fileId, expiresIn = 3600 } = options;

    const productFile = await ProductFile.findByPk(fileId);
    if (!productFile) {
      throw new AppError(StatusCodes.NOT_FOUND, 'File not found');
    }

    // File must be in UPLOADED status
    if (productFile.status !== FileUploadStatus.UPLOADED || !productFile.fileUrl) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'File is not uploaded yet or is invalid'
      );
    }

    // Extract S3 key from URL
    const url = new URL(productFile.fileUrl);
    const s3Key = decodeURIComponent(url.pathname.substring(1));

    // Generate signed URL
    const signedUrl = await s3Service.getSignedDownloadUrl({
      key: s3Key,
      expiresIn,
    });

    return signedUrl;
  }

  /**
   * Get file info
   */
  async getFileInfo(fileId: string): Promise<ProductFile | null> {
    const file = await ProductFile.findByPk(fileId);
    return file;
  }

  /**
   * Delete a product file
   */
  async deleteProductFile(fileId: string, userId: string): Promise<void> {
    try {
      const productFile = await ProductFile.findByPk(fileId);

      if (!productFile) {
        throw new AppError(StatusCodes.NOT_FOUND, 'File not found');
      }

      // Only allow deletion if file is UPLOADED
      if (productFile.status !== FileUploadStatus.UPLOADED || !productFile.fileUrl) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'Cannot delete file with status: ' + productFile.status
        );
      }

      // Extract S3 key from URL
      const url = new URL(productFile.fileUrl);
      const s3Key = decodeURIComponent(url.pathname.substring(1));

      // Delete from S3
      await s3Service.deleteFile({ key: s3Key });

      // Delete from database
      await productFile.destroy();
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('File deletion error:', error);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete file'
      );
    }
  }

  /**
   * Delete a file by S3 key
   */
  async deleteFileByKey(s3Key: string): Promise<void> {
    try {
      await s3Service.deleteFile({ key: s3Key });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('File deletion error:', error);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete file'
      );
    }
  }
}

export default new FileUploadService();
