import { DataTypes, Model, Sequelize } from 'sequelize';

export class Subscriber extends Model {
  declare id: string;
  declare creatorId: string;
  declare subscriberId: string;
  declare status: string;
  declare subscribedAt: Date;
  declare cancelledAt: Date | null;
}

export const initSubscriber = (sequelize: Sequelize) => {
  Subscriber.init(
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
      subscriberId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
      },
      subscribedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'subscribers',
      timestamps: false,
      indexes: [
        { fields: ['creatorId'] },
        { fields: ['subscriberId'] },
        { fields: ['creatorId', 'subscriberId'], unique: true },
      ],
    }
  );

  return Subscriber;
};
