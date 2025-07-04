import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EMPLOYERDOCUMENT_0', timestamps: false })
export class EmployerDocument extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  employerDocId: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  employerId: bigint;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  employerDocUrl: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  documentName: string;

  @Column({ type: DataType.STRING(55), allowNull: true })
  docType: string;

  @Column({ type: DataType.STRING(55), allowNull: true })
  mediaType: string;

  @Column({ type: DataType.DATE, allowNull: true })
  uploadedOn: Date;
}
