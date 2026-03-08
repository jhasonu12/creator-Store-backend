import { DataTypes, Model, Sequelize } from 'sequelize';

export enum FileUploadStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  FAILED = 'failed',
}

export enum FileEntityType {
  PRODUCT = 'product',        // Associated with a product
  PROFILE = 'profile',        // User profile image
  DOCUMENT = 'document',      // General document
}

export class ProductFile extends Model {
  declare id: string;
  declare productId?: string;  // Optional - for product files
  declare userId?: string;     // Optional - for user profile/general files
  declare fileUrl?: string;
  declare fileSize: number;
  declare status: FileUploadStatus;
  declare s3Key?: string;
  declare entityType: FileEntityType; // discriminator field
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getProduct: any;
  declare getUser: any;
}

export const initProductFile = (sequelize: Sequelize) => {
  ProductFile.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true, // optional for non-product files
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true, // optional - for profile/user files
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: true, // null until uploaded
      },
      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'uploaded', 'failed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      s3Key: {
        type: DataTypes.STRING,
        allowNull: true, // optional for tracking S3 key
      },
      entityType: {
        type: DataTypes.ENUM('product', 'profile', 'document'),
        defaultValue: 'product',
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'product_files',
      timestamps: true,
      indexes: [
        { fields: ['productId'] },
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['entityType'] },
      ],
    }
  );

  return ProductFile;
};
