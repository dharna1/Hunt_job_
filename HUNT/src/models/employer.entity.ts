import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { EmployerMedia } from './employerMedia.entity';
import { Job } from './job.entity';
import { Location } from './location.entity';
import { EmployerAward } from './employerAwards.entity';
import { EmployerIndustry } from './employerIndustry.entity';

@Table({ tableName: 'EMPLOYER_0', timestamps: false })
export class Employer extends Model {
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    primaryKey: true,
  })
  @Column({ type: DataType.BIGINT, allowNull: true })
  employerId: bigint;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  token: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  stripeCustomerId: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  signInMethod: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  phoneNumber: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  organizationPhotoURL: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  organizationName: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  organizationLocationId: bigint;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  iOSId: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  employerName: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  email: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  description: string;

  @Column({ type: DataType.DATE, allowNull: true })
  createdOn: Date;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  androidId: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  acn: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  accountStatus: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  abn: string;

  @Column({ type: DataType.DATE, allowNull: true })
  updatedOn: Date;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  organizationBenefits: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  organizationCulture: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  organizationHeadline: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  organizationAddress: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  organizationWebsite: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  gstinNumber: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  panNumber: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalEmployees: bigint;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  })
  active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  })
  approved: boolean;

  @HasMany(() => Job, {
    foreignKey: 'employerId',
    as: 'jobs',
  })
  jobs: Job[];

  @HasMany(() => EmployerMedia, { as: 'media' })
  mediaList: EmployerMedia[];

  @HasMany(() => EmployerAward, { as: 'awards' })
  awards: EmployerAward[];

  @HasMany(() => EmployerIndustry, {
    foreignKey: 'employerId',
    as: 'employerIndustry',
  })
  industry: EmployerIndustry[];

  @BelongsTo(() => Location, {
    foreignKey: 'organizationLocationId',
    as: 'location',
  })
  location: Location;
}
