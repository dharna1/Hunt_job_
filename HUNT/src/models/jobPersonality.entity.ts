import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Job } from './job.entity';
import { Personality } from './personality.entity';

@Table({ tableName: 'JOB_0_PERSONALITIES', timestamps: false })
export class JobPersonalities extends Model<JobPersonalities> {
  @PrimaryKey
  @ForeignKey(() => Job)
  @Column
  jobId: number;

  @Column({ primaryKey: true })
  position: number;

  @ForeignKey(() => Personality)
  @Column
  personalities: number;

  @BelongsTo(() => Personality, {
    foreignKey: 'personalities',
    targetKey: 'personalityId',
    as: 'personalityDetails',
  })
  personalityDetails: Personality[];
}
