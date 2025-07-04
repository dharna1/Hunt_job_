import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EMPLOYEE_0_PAST_EMPLOYER', timestamps: false })
export class PastEmployer extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  pastEmployerId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  employeeId: bigint;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  employerName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: Date;
}
