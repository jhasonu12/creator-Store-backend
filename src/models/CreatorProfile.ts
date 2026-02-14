import { DataTypes, Model, Sequelize } from 'sequelize';

export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
}

export class CreatorProfile extends Model {
  declare id: string;
  declare userId: string;
  declare fullName: string;
  declare phoneNumber: string | null;
  declare timezone: string;
  declare countryCode: string;
  declare trialEndsAt: Date | null;
  declare onboardingCompleted: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getUser: any;
  declare getStoreSlug: any;
  declare getProducts: any;
  declare getSponsoredProducts: any;
  declare getAnalyticsEvents: any;
}

export const initCreatorProfile = (sequelize: Sequelize) => {
  CreatorProfile.init(
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
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timezone: {
        type: DataTypes.STRING,
        defaultValue: 'UTC',
      },
      countryCode: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      trialEndsAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      onboardingCompleted: {
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
      tableName: 'creator_profiles',
      timestamps: true,
      indexes: [{ fields: ['userId'] }],
    }
  );

  return CreatorProfile;
};
