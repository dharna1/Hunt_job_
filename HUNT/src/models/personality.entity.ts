import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'PERSONALITY_0' })
export class Personality extends Model<Personality> {
  @Column({ primaryKey: true })
  personalityId: number;

  @Column
  personality: string;

  @Column
  active: boolean;
}
