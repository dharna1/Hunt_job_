import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: '`INDUSTRY_0`', timestamps: false })
export class Industry extends Model<Industry> {
  @Column({ primaryKey: true, autoIncrement: true })
  industryId: number;

  @Column
  industryName: string;
}
