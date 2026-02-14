import { DataTypes, Model, Sequelize } from 'sequelize';

export class MarketplaceProduct extends Model {
  declare id: string;
  declare productId: string;
  declare isFeatured: boolean;
  declare isNew: boolean;
  declare rankingScore: number;
  declare updatedAt: Date;

  // Associations
  declare getProduct: any;
}

export const initMarketplaceProduct = (sequelize: Sequelize) => {
  MarketplaceProduct.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isNew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rankingScore: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'marketplace_products',
      timestamps: false,
      indexes: [
        { fields: ['productId'] },
        { fields: ['isFeatured'] },
        { fields: ['rankingScore'] },
      ],
    }
  );

  return MarketplaceProduct;
};
