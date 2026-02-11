import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderItem extends Model {
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
  declare price: number;
  declare createdAt: Date;
}

export const initOrderItem = (sequelize: Sequelize) => {
  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'order_items',
      timestamps: false,
      indexes: [
        { fields: ['orderId'] },
        { fields: ['productId'] },
      ],
    }
  );

  return OrderItem;
};
