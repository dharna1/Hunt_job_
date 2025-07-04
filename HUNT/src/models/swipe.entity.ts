import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Job } from './job.entity';
import { Employee } from './employee.entity';
import { Employer } from './employer.entity';

@Table({ tableName: 'SWIPE_0', timestamps: false })
export class Swipe extends Model {
  @ForeignKey(() => Job)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  jobId: bigint;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  employeeId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  employerId: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  employeeSwipe: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  employerSwipe: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  employerSwipeTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  employeeSwipeTime: Date;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  matchPercentage: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: true,
  })
  active: boolean;

  @BelongsTo(() => Job, { foreignKey: 'jobId' })
  job: Job;

  @BelongsTo(() => Employee, { foreignKey: 'employeeId' })
  employee: Employee;

  @BelongsTo(() => Employer, { foreignKey: 'employerId', as: 'employer' })
  employer: Employer;
}
