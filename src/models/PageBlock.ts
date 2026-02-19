import { DataTypes, Model, Sequelize } from 'sequelize';

export enum BlockType {
  HERO = 'hero',
  TESTIMONIAL = 'testimonial',
  FAQ = 'faq',
  PRICING = 'pricing',
  COUNTDOWN = 'countdown',
  GUARANTEE = 'guarantee',
  VIDEO = 'video',
  CHECKOUT_BUTTON = 'checkout_button',
  TEXT = 'text',
  IMAGE = 'image',
  DIVIDER = 'divider',
}

export class PageBlock extends Model {
  declare id: string;
  declare pageId: string;
  declare type: BlockType;
  declare position: number;
  declare data: Record<string, unknown>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initPageBlock = (sequelize: Sequelize): typeof PageBlock => {
  PageBlock.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      pageId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(BlockType)),
        allowNull: false,
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
      tableName: 'page_blocks',
      timestamps: true,
      indexes: [
        { fields: ['pageId'] },
        { fields: ['pageId', 'position'], unique: true },
      ],
    }
  );

  return PageBlock;
};
