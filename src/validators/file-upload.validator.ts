import Joi from 'joi';

// ========== FILE UPLOAD VALIDATORS ==========

/**
 * Get presigned URL for upload
 * userId is extracted from auth token
 * productId only required for product files
 */
export const presignedUrlSchema = Joi.object({
  body: Joi.object({
    originalFilename: Joi.string().max(255).required(),
    contentType: Joi.string().required(),
    productId: Joi.string().uuid().optional(), // For product files only
    entityType: Joi.string().valid('product', 'profile', 'document').optional().default('profile'),
    folder: Joi.string().max(100).optional(),
    expiresIn: Joi.number().min(60).max(86400).optional(), // 1 minute to 24 hours
  })
    .custom((value) => {
      // productId is required only for product entity type
      if (value.entityType === 'product' && !value.productId) {
        throw new Error('productId is required for product file uploads');
      }
      return value;
    })
    .required(),
});

/**
 * Register file after S3 upload
 */
export const registerFileSchema = Joi.object({
  body: Joi.object({
    fileId: Joi.string().uuid().required(), // PENDING file record from presigned URL step
    s3Key: Joi.string().required(),
    fileSize: Joi.number().min(1).required(),
  }).required(),
});

/**
 * Get download URL
 */
export const getDownloadUrlSchema = Joi.object({
  params: Joi.object({
    fileId: Joi.string().uuid().required(),
  }),
  query: Joi.object({
    expiresIn: Joi.number().min(60).max(86400).optional(), // 1 minute to 24 hours
  }),
});

/**
 * Delete file
 */
export const deleteFileSchema = Joi.object({
  params: Joi.object({
    fileId: Joi.string().uuid().required(),
  }),
});

/**
 * Get file info
 */
export const getFileInfoSchema = Joi.object({
  params: Joi.object({
    fileId: Joi.string().uuid().required(),
  }),
});

/**
 * Get product files
 */
export const getProductFilesSchema = Joi.object({
  params: Joi.object({
    productId: Joi.string().uuid().required(),
  }),
});
