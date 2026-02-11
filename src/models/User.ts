import { DataTypes, Model, Sequelize } from 'sequelize';

export class User extends Model {
  declare id: string;
  declare email: string;
  declare username: string;
  declare password: string;
  declare firstName: string | null;
  declare lastName: string | null;
  declare avatar: string | null;
  declare bio: string | null;
  declare isActive: boolean;
  declare isEmailVerified: boolean;
  declare emailVerificationToken: string | null;
  declare emailVerificationTokenExpiresAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getProfile: any;
  declare getCreator: any;
  declare getSubscribers: any;
  declare getSubscriptions: any;
  declare getOrders: any;
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
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
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
        { fields: ['email'] },
        { fields: ['username'] },
      ],
    }
  );

  return User;
};
