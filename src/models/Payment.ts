import { DataTypes, Model, Sequelize } from 'sequelize';

export class Payment extends Model {
  declare id: string;
  declare orderId: string;
  declare amount: number;
  declare currency: string;
  declare status: string;
  declare paymentMethod: string | null;
  declare stripePaymentId: string | null;
  declare stripeCustomerId: string | null;
  declare failureReason: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initPayment = (sequelize: Sequelize) => {
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD',
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripePaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.TEXT,
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
      tableName: 'payments',
      timestamps: true,
      indexes: [
        { fields: ['orderId'] },
        { fields: ['stripePaymentId'] },
      ],
    }
  );

  return Payment;
};
