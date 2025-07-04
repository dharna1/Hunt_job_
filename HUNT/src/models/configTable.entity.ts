import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'CONFIG_0', timestamps: false })
export class ConfigTable extends Model {
  @PrimaryKey
  @Column
  configKey: string;

  @Column
  configValue: string;
}
