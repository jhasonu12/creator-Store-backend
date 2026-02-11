import { DataTypes, Model, Sequelize } from 'sequelize';

export class Review extends Model {
  declare id: string;
  declare productId: string;
  declare userId: string;
  declare rating: number;
  declare title: string | null;
  declare comment: string | null;
  declare helpful: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initReview = (sequelize: Sequelize) => {
  Review.init(
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
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      helpful: {
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
      tableName: 'reviews',
      timestamps: true,
      indexes: [
        { fields: ['productId'] },
        { fields: ['userId'] },
        { fields: ['productId', 'userId'], unique: true },
      ],
    }
  );

  return Review;
};
