import { DataTypes, Model, Sequelize } from 'sequelize';

export class RefreshToken extends Model {
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare revoked: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getUser: any;
}

export const initRefreshToken = (sequelize: Sequelize) => {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revoked: {
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
      tableName: 'refresh_tokens',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['expiresAt'] },
      ],
    }
  );

  return RefreshToken;
};
