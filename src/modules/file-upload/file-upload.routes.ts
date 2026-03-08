import { Router } from 'express';
import fileUploadController from './file-upload.controller';
import { authMiddleware } from '@common/middleware/auth.middleware';
import { validateRequest } from '@common/middleware/validation.middleware';
import {
  presignedUrlSchema,
  registerFileSchema,
  getDownloadUrlSchema,
  deleteFileSchema,
} from '@validators/file-upload.validator';

const router = Router();

/**
 * @route POST /api/v1/files/presigned-url
 * @desc Get a presigned URL for direct S3 upload
 * @access Private
 * 
 * Request Body:
 * {
 *   "originalFilename": "document.pdf",
 *   "contentType": "application/pdf",
 *   "folder": "documents" (optional, default: "assets")
 *   "expiresIn": 3600 (optional, default: 1 hour)
 * }
 * 
 * Response:
 * {
 *   "presignedUrl": "https://bucket.s3.aws.com/...",
 *   "s3Key": "uploads/documents/...",
 *   "bucket": "bucket-name"
 * }
 * 
 * Flow:
 * 1. Call this endpoint to get presigned URL
 * 2. Upload file directly to presignedUrl using PUT request
 * 3. Call POST /files/register to register file in database
 */
router.post(
  '/presigned-url',
  authMiddleware,
  validateRequest(presignedUrlSchema),
  fileUploadController.getPresignedUrl
);

/**
 * @route POST /api/v1/files/register
 * @desc Register a file that was uploaded to S3
 * @access Private
 * 
 * Request Body:
 * {
 *   "productId": "product-uuid",
 *   "s3Key": "uploads/documents/1234567890-abc123-file.pdf",
 *   "fileSize": 2048576
 * }
 * 
 * Response:
 * {
 *   "id": "file-uuid",
 *   "productId": "product-uuid",
 *   "fileUrl": "https://bucket.s3.aws.com/...",
 *   "fileSize": 2048576,
 *   "createdAt": "2026-03-08T10:00:00Z",
 *   "updatedAt": "2026-03-08T10:00:00Z"
 * }
 * 
 * Call this after successfully uploading file to S3 using presigned URL
 */
router.post(
  '/register',
  authMiddleware,
  validateRequest(registerFileSchema),
  fileUploadController.registerFile
);

/**
 * @route GET /api/v1/files/products/:productId
 * @desc Get all files for a product
 * @access Public
 */
router.get(
  '/products/:productId',
  fileUploadController.getProductFiles
);

/**
 * @route GET /api/v1/files/:fileId
 * @desc Get file info
 * @access Public
 */
router.get(
  '/:fileId',
  fileUploadController.getFileInfo
);

/**
 * @route GET /api/v1/files/:fileId/download
 * @desc Get a signed download URL for a file
 * @access Private
 * 
 * Query Parameters:
 * - expiresIn: URL expiration time in seconds (60-86400, default: 3600)
 */
router.get(
  '/:fileId/download',
  authMiddleware,
  validateRequest(getDownloadUrlSchema),
  fileUploadController.getDownloadUrl
);

/**
 * @route DELETE /api/v1/files/:fileId
 * @desc Delete a file
 * @access Private
 */
router.delete(
  '/:fileId',
  authMiddleware,
  validateRequest(deleteFileSchema),
  fileUploadController.deleteFile
);

export default router;
