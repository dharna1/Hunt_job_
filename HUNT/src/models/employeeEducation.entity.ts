import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Employee } from './employee.entity';
import { CourseType } from './courseType.entity';
import { Institute } from './institute.entity';

@Table({ tableName: 'EMPLOYEE_0_EDUCATION', timestamps: false })
export class EmployeeEducation extends Model {
  @ForeignKey(() => Employee)
  @PrimaryKey // Define this as part of the composite key
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  employeeId: bigint;

  @PrimaryKey // Define this as part of the composite key
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  position: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  educationId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  year: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  acheivement: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  instituteId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  courseId: number;

  @BelongsTo(() => CourseType, {
    foreignKey: 'courseId',
    targetKey: 'courseId',
    as: 'courseType',
  })
  courseType: CourseType[];

  @BelongsTo(() => Institute, {
    foreignKey: 'instituteId',
    targetKey: 'instituteId',
    as: 'institute',
  })
  institute: Institute[];
}
