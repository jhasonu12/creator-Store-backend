import { DataTypes, Model, Sequelize } from 'sequelize';

export enum StoreSlugStatus {
  RESERVED = 'RESERVED',
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
}

export class StoreSlug extends Model {
  declare id: string;
  declare slug: string;
  declare creatorId: string;
  declare status: StoreSlugStatus;
  declare reservedAt: Date;
  declare activatedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getCreatorProfile: any;
}

export const initStoreSlug = (sequelize: Sequelize) => {
  StoreSlug.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(StoreSlugStatus)),
        defaultValue: StoreSlugStatus.RESERVED,
      },
      reservedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      activatedAt: {
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
      tableName: 'store_slugs',
      timestamps: true,
      indexes: [
        { fields: ['slug'] },
        { fields: ['creatorId'] },
      ],
    }
  );

  return StoreSlug;
};
