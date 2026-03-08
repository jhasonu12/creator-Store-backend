import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StatusCodes } from 'http-status-codes';
import { config } from '@config/environment';
import { AppError } from '@common/utils/response';

export interface S3PresignedUrlOptions {
  key: string;
  contentType: string;
  expiresIn?: number; // seconds
}

export interface S3DeleteOptions {
  key: string;
}

export interface S3GetSignedUrlOptions {
  key: string;
  expiresIn?: number; // seconds
}

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    const { accessKeyId, secretAccessKey, region, s3BucketName } = config.aws;

    if (!accessKeyId || !secretAccessKey || !s3BucketName) {
      throw new Error('S3 credentials are not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME env variables.');
    }

    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucketName = s3BucketName;
  }

  /**
   * Generate a presigned PUT URL for direct file upload to S3
   * User can upload directly to S3 using this URL
   */
  async getPresignedUploadUrl(options: S3PresignedUrlOptions): Promise<string> {
    try {
      const { key, contentType, expiresIn = 3600 } = options; // Default: 1 hour

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(this.s3Client as any, command as any, {
        expiresIn,
      });

      return url;
    } catch (error: any) {
      console.error('S3 presigned URL error:', error);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to generate presigned upload URL: ${error.message}`
      );
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(options: S3DeleteOptions): Promise<void> {
    try {
      const { key } = options;

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error: any) {
      console.error('S3 delete error:', error);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to delete file from S3: ${error.message}`
      );
    }
  }

  /**
   * Generate a signed URL for private file access
   * Useful for time-limited access to private files
   */
  async getSignedDownloadUrl(options: S3GetSignedUrlOptions): Promise<string> {
    try {
      const { key, expiresIn = 3600 } = options; // Default: 1 hour

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client as any, command as any, {
        expiresIn,
      });

      return url;
    } catch (error: any) {
      console.error('S3 signed URL error:', error);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to generate signed download URL: ${error.message}`
      );
    }
  }

  /**
   * Get public URL for a file in S3
   * Note: Only works if the object has public-read ACL
   */
  getPublicUrl(key: string): string {
    const region = config.aws.region;
    return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
  }

  /**
   * Check if a file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return false;
      }
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to check file existence: ${error.message}`
      );
    }
  }

  /**
   * Generate a unique S3 key for file uploads
   * Format: uploads/{folder}/{timestamp}-{randomId}-{originalFilename}
   */
  generateS3Key(folder: string, originalFilename: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const sanitizedFilename = originalFilename
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .toLowerCase();

    return `uploads/${folder}/${timestamp}-${randomId}-${sanitizedFilename}`;
  }

  /**
   * Get bucket name
   */
  getBucketName(): string {
    return this.bucketName;
  }
}

export default new S3Service();
