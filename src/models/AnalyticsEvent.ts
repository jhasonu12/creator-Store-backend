import { DataTypes, Model, Sequelize } from 'sequelize';

export class AnalyticsEvent extends Model {
  declare id: string;
  declare eventType: string;
  declare userId: string | null;
  declare creatorId: string | null;
  declare productId: string | null;
  declare metadata: object;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare createdAt: Date;

  // Associations
  declare getUser: any;
  declare getCreatorProfile: any;
  declare getProduct: any;
}

export const initAnalyticsEvent = (sequelize: Sequelize) => {
  AnalyticsEvent.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
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
      tableName: 'analytics_events',
      timestamps: false,
      indexes: [
        { fields: ['eventType'] },
        { fields: ['userId'] },
        { fields: ['creatorId'] },
        { fields: ['productId'] },
        { fields: ['createdAt'] },
      ],
    }
  );

  return AnalyticsEvent;
};
