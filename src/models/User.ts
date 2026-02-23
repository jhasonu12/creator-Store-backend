import { DataTypes, Model, Sequelize } from 'sequelize';

export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
}

export class User extends Model {
  declare id: string;
  declare email: string;
  declare username: string;
  declare password: string;
  declare avatar: string | null;
  declare bio: string | null;
  declare role: UserRole;
  declare isVerified: boolean;
  declare isActive: boolean;
  declare isEmailVerified: boolean;
  declare emailVerificationToken: string | null;
  declare emailVerificationTokenExpiresAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getProfile: any;
  declare getCreatorProfile: any;
  declare getRefreshTokens: any;
  declare getOrders: any;
  declare getSubscriptions: any;
  declare getAnalyticsEvents: any;
  declare getReviews: any;
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.USER,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailVerificationTokenExpiresAt: {
        type: DataTypes.DATE,
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
      tableName: 'users',
      timestamps: true,
      indexes: [
        { fields: ['username'] },
        { fields: ['role'] },
      ],
    }
  );

  return User;
};
