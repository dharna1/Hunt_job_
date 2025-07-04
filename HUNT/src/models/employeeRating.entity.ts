import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EMPLOYEE_0_RATING', timestamps: false })
export class EmployeeRating extends Model {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  rating: number;
}
