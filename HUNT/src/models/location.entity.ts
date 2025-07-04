import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Job } from './job.entity';
import { Employee } from './employee.entity';

@Table({ tableName: 'LOCATION_0', timestamps: false })
export class Location extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  locationId: bigint;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  suburb: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  state: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  postcode: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  latitude: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  longitude: string;

  @HasMany(() => Job, {
    foreignKey: 'locationId',
    as: 'jobs',
  })
  jobs: Job[];

  @HasMany(() => Employee, {
    foreignKey: 'employeeId',
    as: 'employeeRating',
  })
  employeeRating: Employee[];
}
