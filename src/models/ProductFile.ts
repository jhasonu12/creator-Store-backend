import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductFile extends Model {
  declare id: string;
  declare productId: string;
  declare fileUrl: string;
  declare fileSize: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getProduct: any;
}

export const initProductFile = (sequelize: Sequelize) => {
  ProductFile.init(
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
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
      tableName: 'product_files',
      timestamps: true,
      indexes: [{ fields: ['productId'] }],
    }
  );

  return ProductFile;
};
