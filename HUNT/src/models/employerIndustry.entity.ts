import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Employer } from './employer.entity';
import { Industry } from './industry.entity';

@Table({ tableName: 'EMPLOYER_0_INDUSTRY', timestamps: false })
export class EmployerIndustry extends Model<EmployerIndustry> {
  @ForeignKey(() => Employer)
  @Column
  employerId: number;

  @Column({ primaryKey: true })
  position: number;

  @Column
  industryId: number;

  @BelongsTo(() => Industry, {
    foreignKey: 'industryId',
    as: 'industry',
  })
  industry: Industry[];
}
