import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Job } from './job.entity';
import { Skill } from './skills.entity';

@Table({ tableName: 'JOB_0_SKILLS', timestamps: false })
export class JobSkills extends Model<JobSkills> {
  @ForeignKey(() => Job)
  @PrimaryKey
  @Column
  jobId: number;

  @ForeignKey(() => Skill)
  @PrimaryKey
  @Column
  skillId: number;

  @BelongsTo(() => Skill, {
    foreignKey: 'skillId',
    targetKey: 'id',
    as: 'skills',
  })
  skills: Skill[];
}
