import { DataTypes, Model, Sequelize } from 'sequelize';

export class Profile extends Model {
  declare id: string;
  declare userId: string;
  declare bio: string | null;
  declare location: string | null;
  declare website: string | null;
  declare socialLinks: any;
  declare verified: boolean;
  declare verificationBadge: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initProfile = (sequelize: Sequelize) => {
  Profile.init(
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
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationBadge: {
        type: DataTypes.STRING,
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
      tableName: 'profiles',
      timestamps: true,
    }
  );

  return Profile;
};
