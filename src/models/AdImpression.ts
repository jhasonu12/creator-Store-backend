import { DataTypes, Model, Sequelize } from 'sequelize';

export class AdImpression extends Model {
  declare id: string;
  declare sponsoredProductId: string;
  declare userId: string | null;
  declare createdAt: Date;

  // Associations
  declare getSponsoredProduct: any;
  declare getUser: any;
}

export const initAdImpression = (sequelize: Sequelize) => {
  AdImpression.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      sponsoredProductId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'ad_impressions',
      timestamps: false,
      indexes: [
        { fields: ['sponsoredProductId'] },
        { fields: ['userId'] },
      ],
    }
  );

  return AdImpression;
};
