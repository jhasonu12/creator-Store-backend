import { DataTypes, Model, Sequelize } from 'sequelize';

export enum StoreType {
  LINKSITE = 'linksite',
  FUNNEL = 'funnel',
  HYBRID = 'hybrid',
}

export enum StoreStatus {
  DRAFT = 0,
  ACTIVE = 1,
  ARCHIVED = 2,
}

export class Store extends Model {
  declare id: string;
  declare creatorId: string;
  declare type: StoreType;
  declare status: StoreStatus;
  declare slug: string;
  declare name: string;
  declare description: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initStore = (sequelize: Sequelize): typeof Store => {
  Store.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(StoreType)),
        defaultValue: StoreType.LINKSITE,
      },
      status: {
        type: DataTypes.SMALLINT,
        defaultValue: StoreStatus.ACTIVE,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
      tableName: 'stores',
      timestamps: true,
      indexes: [{ fields: ['creatorId'] }, { fields: ['slug'] }],
    }
  );

  return Store;
};
