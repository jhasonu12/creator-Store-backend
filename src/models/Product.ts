import { DataTypes, Model, Sequelize } from 'sequelize';

export enum ProductType {
  DIGITAL = 'DIGITAL',
  COURSE = 'COURSE',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

export enum ProductStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  ARCHIVED = 2,
}

export enum StyleType {
  BUTTON = 'Button',
  CALLOUT = 'Callout',
  PREVIEW = 'Preview',
}

export class Product extends Model {
  declare id: string;
  declare creatorId: string;
  declare type: ProductType;
  declare title: string;
  declare subtitle: string | null;
  declare thumbnailUrl: string | null;
  declare slug: string;
  declare displayStyle: StyleType;
  declare ctaButtonText: string;
  declare status: ProductStatus;
  declare position: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getCreatorProfile: any;
  declare getProductFiles: any;
  declare getCourse: any;
  declare getOrderItems: any;
  declare getSponsoredProduct: any;
  declare getAnalyticsEvents: any;
}

export const initProduct = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ProductType)),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86b52?w=400&h=300&fit=crop&crop=entropy&cs=tinysrgb&q=60&ixlib=rb-4.0.3',
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'products_creator_slug_unique',
      },
      displayStyle: {
        type: DataTypes.ENUM(...Object.values(StyleType)),
        defaultValue: StyleType.BUTTON,
      },
      ctaButtonText: {
        type: DataTypes.STRING,
        defaultValue: 'Get Access',
      },
      status: {
        type: DataTypes.SMALLINT,
        defaultValue: ProductStatus.DRAFT,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: 'products',
      timestamps: true,
      indexes: [
        { fields: ['creatorId'] },
        { fields: ['status'] },
        { fields: ['type'] },
        { fields: ['creatorId', 'slug'], unique: true },
      ],
    }
  );

  return Product;
};
