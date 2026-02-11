import { DataTypes, Model, Sequelize } from 'sequelize';

export class ActivityLog extends Model {
  declare id: string;
  declare userId: string | null;
  declare action: string;
  declare entityType: string;
  declare entityId: string;
  declare changes: any;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare createdAt: Date;
}

export const initActivityLog = (sequelize: Sequelize) => {
  ActivityLog.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'activity_logs',
      timestamps: false,
      indexes: [
        { fields: ['userId'] },
        { fields: ['entityType'] },
        { fields: ['entityId'] },
      ],
    }
  );

  return ActivityLog;
};
