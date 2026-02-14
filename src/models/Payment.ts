import { DataTypes, Model, Sequelize } from 'sequelize';

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class Payment extends Model {
  declare id: string;
  declare orderId: string;
  declare providerPaymentId: string;
  declare status: PaymentStatus;
  declare rawResponse: object;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getOrder: any;
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
      providerPaymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
      },
      rawResponse: {
        type: DataTypes.JSONB,
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
      tableName: 'payments',
      timestamps: true,
      indexes: [
        { fields: ['orderId'] },
        { fields: ['providerPaymentId'] },
      ],
    }
  );

  return Payment;
};
