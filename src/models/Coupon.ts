import { DataTypes, Model, Sequelize } from 'sequelize';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class Coupon extends Model {
  declare id: string;
  declare code: string;
  declare discountType: DiscountType;
  declare value: number;
  declare expiresAt: Date;
  declare usageLimit: number | null;
  declare usedCount: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initCoupon = (sequelize: Sequelize) => {
  Coupon.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      discountType: {
        type: DataTypes.ENUM(...Object.values(DiscountType)),
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      tableName: 'coupons',
      timestamps: true,
      indexes: [
        { fields: ['code'] },
        { fields: ['expiresAt'] },
      ],
    }
  );

  return Coupon;
};
