import { DataTypes, Model, Sequelize } from 'sequelize';

export class CourseSection extends Model {
  declare id: string;
  declare courseId: string;
  declare title: string;
  declare position: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getCourse: any;
  declare getCourseLessons: any;
}

export const initCourseSection = (sequelize: Sequelize) => {
  CourseSection.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: 'course_sections',
      timestamps: true,
      indexes: [{ fields: ['courseId'] }],
    }
  );

  return CourseSection;
};
