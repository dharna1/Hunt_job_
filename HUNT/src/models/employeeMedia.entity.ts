import { Employee } from 'src/models/employee.entity';
import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';

@Table({ tableName: 'EMPLOYEE_0_MEDIA' })
export class EmployeeMedia extends Model<EmployeeMedia> {
  @Column({ primaryKey: true, autoIncrement: true })
  mediaId: number;

  @ForeignKey(() => Employee)
  @Column
  employeeId: number;

  @Column
  position: number;

  @Column
  url: string;

  @Column
  thumbnail: string;

  @Column
  mediaType: string;
}
