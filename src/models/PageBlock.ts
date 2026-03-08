import { DataTypes, Model, Sequelize } from 'sequelize';

export enum BlockType {
  TESTIMONIAL = 'testimonial',
  FAQ = 'faq',
}

/**
 * Data schema for testimonial/review block
 */
export interface TestimonialBlockSchema {
  name: string; // Name of the reviewer
  image?: string; // Optional image URL
  content: string; // Review text
  rating?: number; // Optional 1-5 rating
}

/**
 * Data schema for FAQ block
 */
export interface FAQBlockSchema {
  question: string; // FAQ question
  answer: string; // FAQ answer
}

/**
 * Union type for block data schemas
 */
export type BlockDataSchema = TestimonialBlockSchema | FAQBlockSchema;

export class PageBlock extends Model {
  declare id: string;
  declare pageId: string;
  declare type: BlockType;
  declare position: number;
  declare data: BlockDataSchema;
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
