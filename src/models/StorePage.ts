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

export class StorePage extends Model {
  declare id: string;
  declare storeId: string;
  declare productId: string | null;
  declare slug: string;
  declare type: PageType;
  declare status: PageStatus;
  declare position: number;
  declare data: Record<string, unknown>;
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
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(PageType)),
        allowNull: false,
      },
      status: {
        type: DataTypes.SMALLINT,
        defaultValue: PageStatus.DRAFT,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        { fields: ['slug'] },
        { fields: ['storeId', 'position'], unique: true },
      ],
    }
  );

  return StorePage;
};
