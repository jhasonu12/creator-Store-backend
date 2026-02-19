import { DataTypes, Model, Sequelize } from 'sequelize';

export enum SectionType {
  TITLE = 'title',
  PRODUCT_LINK = 'product_link',
  EXTERNAL_LINK = 'external_link',
  COURSE_CARD = 'course_card',
  DIVIDER = 'divider',
  IMAGE = 'image',
  SOCIAL_LINKS = 'social_links',
  EMAIL_CAPTURE = 'email_capture',
}

export enum SectionStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  HIDDEN = 2,
}

export class StoreSection extends Model {
  declare id: string;
  declare storeId: string;
  declare type: SectionType;
  declare status: SectionStatus;
  declare position: number;
  declare data: Record<string, unknown>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initStoreSection = (sequelize: Sequelize): typeof StoreSection => {
  StoreSection.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(SectionType)),
        allowNull: false,
      },
      status: {
        type: DataTypes.SMALLINT,
        defaultValue: SectionStatus.PUBLISHED,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
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
      tableName: 'store_sections',
      timestamps: true,
      indexes: [
        { fields: ['storeId'] },
        { fields: ['storeId', 'position'], unique: true },
      ],
    }
  );

  return StoreSection;
};
