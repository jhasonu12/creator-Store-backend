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

export class Product extends Model {
  declare id: string;
  declare creatorId: string;
  declare type: ProductType;
  declare title: string;
  declare description: string;
  declare price: number;
  declare currency: string;
  declare thumbnailUrl: string | null;
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'USD',
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
      ],
    }
  );

  return Product;
};
