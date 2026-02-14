import { DataTypes, Model, Sequelize } from 'sequelize';

export enum SponsoredProductStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

export enum PricingModel {
  CPC = 'CPC', // Cost Per Click
  CPM = 'CPM', // Cost Per Mille (thousand impressions)
  FLAT = 'FLAT', // Flat fee
}

export class SponsoredProduct extends Model {
  declare id: string;
  declare productId: string;
  declare creatorId: string;
  declare pricingModel: PricingModel;
  declare bidAmount: number;
  declare startDate: Date;
  declare endDate: Date;
  declare status: SponsoredProductStatus;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getProduct: any;
  declare getCreatorProfile: any;
}

export const initSponsoredProduct = (sequelize: Sequelize) => {
  SponsoredProduct.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      pricingModel: {
        type: DataTypes.ENUM(...Object.values(PricingModel)),
        allowNull: false,
      },
      bidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(SponsoredProductStatus)),
        defaultValue: SponsoredProductStatus.ACTIVE,
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
      tableName: 'sponsored_products',
      timestamps: true,
      indexes: [
        { fields: ['productId'] },
        { fields: ['creatorId'] },
        { fields: ['status'] },
      ],
    }
  );

  return SponsoredProduct;
};
