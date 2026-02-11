import { DataTypes, Model, Sequelize } from 'sequelize';

export class Product extends Model {
  declare id: string;
  declare creatorId: string;
  declare title: string;
  declare slug: string;
  declare description: string | null;
  declare price: number;
  declare currency: string;
  declare images: string[];
  declare status: string;
  declare category: string | null;
  declare tags: string[];
  declare rating: number;
  declare totalReviews: number;
  declare stock: number | null;
  declare isDigital: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initProduct = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
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
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD',
      },
      images: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'draft',
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isDigital: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: 'products',
      timestamps: true,
      indexes: [
        { fields: ['creatorId'] },
        { fields: ['status'] },
        { fields: ['category'] },
        { fields: ['creatorId', 'slug'], unique: true },
      ],
    }
  );

  return Product;
};
