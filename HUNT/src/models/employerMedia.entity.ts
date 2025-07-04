import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Employer } from './employer.entity';

@Table({ tableName: 'EMPLOYER_0_MEDIA' })
export class EmployerMedia extends Model<EmployerMedia> {
  @Column({ primaryKey: true, autoIncrement: true })
  mediaId: number;

  @ForeignKey(() => Employer)
  @Column
  employerId: number;

  @Column
  position: number;

  @Column
  url: string;

  @Column
  thumbnail: string;

  @Column
  mediaType: string;
}
