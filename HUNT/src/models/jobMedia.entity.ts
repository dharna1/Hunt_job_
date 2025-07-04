import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Job } from './job.entity';

@Table({ tableName: 'JOB_0_MEDIA', timestamps: false })
export class JobMedia extends Model<JobMedia> {
  @Column({ primaryKey: true, autoIncrement: true })
  mediaId: number;

  @ForeignKey(() => Job)
  @Column
  jobId: number;

  @Column
  position: number;

  @Column({ type: DataType.STRING(1000), allowNull: false })
  url: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  thumbnail: string;

  @Column({
    type: DataType.ENUM('IMAGE', 'VIDEO'),
    allowNull: false,
  })
  mediaType: string;
}
