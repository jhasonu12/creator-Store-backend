import { DataTypes, Model, Sequelize } from 'sequelize';

export class SubscriptionTier extends Model {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare billingCycle: string;
  declare features: any;
  declare maxSupport: number | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initSubscriptionTier = (sequelize: Sequelize) => {
  SubscriptionTier.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      billingCycle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      features: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      maxSupport: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: 'subscription_tiers',
      timestamps: true,
    }
  );

  return SubscriptionTier;
};
