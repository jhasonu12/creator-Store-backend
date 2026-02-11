import { DataTypes, Model, Sequelize } from 'sequelize';

export class Order extends Model {
  declare id: string;
  declare userId: string;
  declare orderNumber: string;
  declare status: string;
  declare totalAmount: number;
  declare currency: string;
  declare shippingAddress: any;
  declare notes: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initOrder = (sequelize: Sequelize) => {
  Order.init(
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
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD',
      },
      shippingAddress: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      notes: {
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
      tableName: 'orders',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['orderNumber'] },
      ],
    }
  );

  return Order;
};
