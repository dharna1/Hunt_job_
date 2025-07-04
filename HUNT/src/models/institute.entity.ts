import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: '`INSTITUTE_0`', timestamps: false })
export class Institute extends Model<Institute> {
  @Column({ primaryKey: true, autoIncrement: true })
  instituteId: number;

  @Column
  address: string;

  @Column
  name: string;
}
