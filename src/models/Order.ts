import { DataTypes, Model, Sequelize } from 'sequelize';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class Order extends Model {
  declare id: string;
  declare buyerId: string | null;
  declare email: string;
  declare status: OrderStatus;
  declare totalAmount: number;
  declare currency: string;
  declare paymentProvider: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getUser: any;
  declare getOrderItems: any;
  declare getPayment: any;
}

export const initOrder = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      buyerId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PENDING,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'USD',
      },
      paymentProvider: {
        type: DataTypes.STRING,
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
      tableName: 'orders',
      timestamps: true,
      indexes: [
        { fields: ['buyerId'] },
        { fields: ['email'] },
        { fields: ['status'] },
      ],
    }
  );

  return Order;
};
