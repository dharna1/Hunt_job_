import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Employee } from './employee.entity';
import { Employer } from './employer.entity';

@Table({ tableName: 'SUSPICIOUS_EMPLOYEE_0', timestamps: false })
export class SuspiciousEmployee extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  employerId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  employeeId: bigint;

  @Column({
    type: DataType.ENUM(
      'Should be tagged as offensive (rude, Obscene, etc.)',
      'Wrong Content in the profile (details, images, etc.)',
      'Not mentioned in the list',
    ),
    allowNull: false,
  })
  reason: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reportedOn: Date;

  @BelongsTo(() => Employee, { foreignKey: 'employeeId' })
  employee: Employee;

  @BelongsTo(() => Employer, { foreignKey: 'employerId' })
  employer: Employer;
}
