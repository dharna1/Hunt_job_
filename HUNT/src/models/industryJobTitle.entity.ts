import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Job } from './job.entity';

@Table({ tableName: 'INDUSTRY_0_JOBTITLES', timestamps: false })
export class IndustryJobTitle extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  industryId: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  jobTitleId: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  jobName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  jobResponsibilitieExample: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  jobQualificationExample: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  jobResponsibilitieDiscription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  jobQualificationDiscription: string;

  @HasMany(() => Job, {
    foreignKey: 'jobTitleId',
    as: 'jobs',
  })
  jobs: Job[];
}
