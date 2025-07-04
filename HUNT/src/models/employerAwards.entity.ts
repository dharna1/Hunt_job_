import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Employer } from './employer.entity';

@Table({ tableName: 'EMPLOYER_0_AWARDS', timestamps: false })
export class EmployerAward extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  awardId: bigint;

  @ForeignKey(() => Employer)
  @Column
  employerId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  position: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  awardYear: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  awardDescription: string;
}
