import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { Job } from './job.entity';
import { CourseType } from './courseType.entity';
@Table({ tableName: 'JOB_0_EDUCATION', timestamps: false })
export class JobEducation extends Model {
  @ForeignKey(() => Job)
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  jobId: bigint;

  @ForeignKey(() => CourseType)
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  courseId: bigint;

  @BelongsTo(() => CourseType, {
    foreignKey: 'courseId',
    as: 'courseType',
  })
  courseType: CourseType[];
}
