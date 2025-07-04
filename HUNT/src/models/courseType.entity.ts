import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'COURSE_TYPE_0', timestamps: false })
export class CourseType extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  courseId: bigint;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  courseName: string;
}
