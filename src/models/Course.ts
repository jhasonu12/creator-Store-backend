import { DataTypes, Model, Sequelize } from 'sequelize';

export class Course extends Model {
  declare id: string;
  declare productId: string;
  declare totalDuration: number;
  declare certificateEnabled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getProduct: any;
  declare getCourseSections: any;
  declare getCourseProgress: any;
}

export const initCourse = (sequelize: Sequelize) => {
  Course.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      totalDuration: {
        type: DataTypes.INTEGER,
        comment: 'Duration in minutes',
      },
      certificateEnabled: {
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
      tableName: 'courses',
      timestamps: true,
      indexes: [{ fields: ['productId'] }],
    }
  );

  return Course;
};
