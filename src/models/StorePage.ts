import { DataTypes, Model, Sequelize } from 'sequelize';

export enum PageType {
  DIGITAL_DOWNLOAD = 'digital-download',
  COURSE = 'course',
  SUBSCRIPTION = 'subscription',
  CHECKOUT = 'checkout',
  UPSELL = 'upsell',
  THANK_YOU = 'thank-you',
}

export enum PageStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  ARCHIVED = 2,
}

/**
 * Form configuration schema for lead capture
 * Defines which customer information to collect
 */
export interface FormConfig {
  collectName: boolean;
  collectEmail: boolean;
}

/**
 * Digital asset for download (e.g., PDF, files)
 */
export interface DigitalAsset {
  url: string;
  name: string;
  assetType: 'file' | 'link';
}

/**
 * Data schema for StorePage JSON field
 * Contains page-specific configuration and pricing information
 */
export interface PageDataSchema {
  // Page metadata
  title: string;
  description?: string;
  
  // Pricing information (for checkout pages)
  price?: number;
  currency?: string;
  discountPrice?: number | null;
  isDiscountPriceAvailable?: boolean;
  
  // Form configuration for lead capture
  form?: FormConfig;
  
  // Digital assets for download
  digitalAssets?: DigitalAsset[];
  
  // Page-specific content (flexible for different page types)
  [key: string]: unknown;
}

export class StorePage extends Model {
  declare id: string;
  declare storeId: string;
  declare productId: string;
  declare type: PageType;
  declare status: PageStatus;
  declare data: PageDataSchema;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initStorePage = (sequelize: Sequelize): typeof StorePage => {
  StorePage.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(PageType)),
        allowNull: false,
      },
      status: {
        type: DataTypes.SMALLINT,
        defaultValue: PageStatus.DRAFT,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
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
      tableName: 'store_pages',
      timestamps: true,
      indexes: [
        { fields: ['storeId'] },
        { fields: ['productId'] },
      ],
    }
  );

  return StorePage;
};
