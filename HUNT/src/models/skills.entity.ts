import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { IndustryJobTitle } from './industryJobTitle.entity';

@Table({ tableName: 'SKILLS_0', timestamps: false })
export class Skill extends Model<Skill> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @ForeignKey(() => IndustryJobTitle)
  @Column
  jobTitleId: number;

  @Column({
    type: 'ENUM',
    values: ['ACTIVE', 'SOFT'],
  })
  type: 'ACTIVE' | 'SOFT';
}
