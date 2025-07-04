import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EMPLOYEE_0_EXPERIENCE', timestamps: false })
export class EmployeeExperience extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  experienceId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  employeeId: bigint;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  companyName: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  jobTitle: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  jobType: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  noticePeriod: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  joiningDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  leavingDate: Date;
}
