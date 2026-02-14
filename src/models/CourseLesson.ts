import { DataTypes, Model, Sequelize } from 'sequelize';

export enum LessonContentType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  PDF = 'PDF',
}

export class CourseLesson extends Model {
  declare id: string;
  declare sectionId: string;
  declare title: string;
  declare contentType: LessonContentType;
  declare contentUrl: string;
  declare duration: number;
  declare position: number;
  declare isPreview: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare getCourseSection: any;
}

export const initCourseLesson = (sequelize: Sequelize) => {
  CourseLesson.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      sectionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contentType: {
        type: DataTypes.ENUM(...Object.values(LessonContentType)),
        allowNull: false,
      },
      contentUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        comment: 'Duration in minutes',
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isPreview: {
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
      tableName: 'course_lessons',
      timestamps: true,
      indexes: [{ fields: ['sectionId'] }],
    }
  );

  return CourseLesson;
};
