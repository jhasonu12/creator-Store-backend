import { DataTypes, Model, Sequelize } from 'sequelize';

export class CourseProgress extends Model {
  declare id: string;
  declare userId: string;
  declare courseId: string;
  declare lastLessonId: string | null;
  declare completedLessons: object;
  declare progressPercentage: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getUser: any;
  declare getCourse: any;
}

export const initCourseProgress = (sequelize: Sequelize) => {
  CourseProgress.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      lastLessonId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      completedLessons: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      progressPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
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
      tableName: 'course_progress',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['courseId'] },
        { fields: ['userId', 'courseId'], unique: true },
      ],
    }
  );

  return CourseProgress;
};
