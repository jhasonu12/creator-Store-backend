import { DataTypes, Model, Sequelize } from 'sequelize';

export class Subscription extends Model {
  declare id: string;
  declare userId: string;
  declare tierId: string;
  declare status: string;
  declare currentPeriodStart: Date;
  declare currentPeriodEnd: Date;
  declare cancelledAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initSubscription = (sequelize: Sequelize) => {
  Subscription.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      tierId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
      },
      currentPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      currentPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
      tableName: 'subscriptions',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['tierId'] },
      ],
    }
  );

  return Subscription;
};
