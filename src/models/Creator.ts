import { DataTypes, Model, Sequelize } from 'sequelize';

export class Creator extends Model {
  declare id: string;
  declare userId: string;
  declare displayName: string;
  declare slug: string;
  declare description: string | null;
  declare profileImage: string | null;
  declare bannerImage: string | null;
  declare isVerified: boolean;
  declare verificationDate: Date | null;
  declare totalEarnings: number;
  declare rating: number;
  declare totalReviews: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initCreator = (sequelize: Sequelize) => {
  Creator.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bannerImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      totalEarnings: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalReviews: {
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
      tableName: 'creators',
      timestamps: true,
      indexes: [
        { fields: ['slug'] },
        { fields: ['userId'] },
      ],
    }
  );

  return Creator;
};
