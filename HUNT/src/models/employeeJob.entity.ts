import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { IndustryJobTitle } from './industryJobTitle.entity';
import { Industry } from './industry.entity';

@Table({ tableName: 'EMPLOYEE_0_JOBS', timestamps: false })
export class EmployeeJob extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true, // Set primary key as employeeId for this table
  })
  employeeId: bigint;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  position: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  industryId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  jobTitleId: bigint;

  @BelongsTo(() => IndustryJobTitle, {
    as: 'industryJobTitle',
    foreignKey: 'jobTitleId',
    targetKey: 'jobTitleId',
  })
  industryJobTitle: IndustryJobTitle;

  @BelongsTo(() => Industry, {
    as: 'industry',
    foreignKey: 'industryId',
    targetKey: 'industryId',
  })
  industry: IndustryJobTitle;
}
