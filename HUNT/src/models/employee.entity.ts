import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { EmployeeMedia } from './employeeMedia.entity';
import { Location } from './location.entity';
import { EmployeeEducation } from './employeeEducation.entity';
import { EmployeeJob } from './employeeJob.entity';
import { EmployeeExperience } from './employeeExperience.entity';
import { EmployeeSkills } from './employeeSkills.entity';
import { SuspiciousEmployee } from './suspiciousEmployee.entity';
import { Swipe } from './swipe.entity';
import { EmployeePersonality } from './employeePersonalities.entity';

@Table({ tableName: 'EMPLOYEE_0', timestamps: false })
export class Employee extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  employeeId: bigint;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  employeeName: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  uid: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  locationId: bigint;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  curriculumVitaeURL: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  signInMethod: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  accountStatus: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  gender: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdOn: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedOn: Date;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  photoURL: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  androidId: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  iOSId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  vaccinated: boolean;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  token: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  profileHeadline: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  experienceYear: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  experienceMonth: number;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  portfolioLink: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  discoverable: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  reported: boolean;

  @HasMany(() => EmployeeMedia, { as: 'media' })
  mediaList: EmployeeMedia[];

  @HasMany(() => EmployeeSkills, { as: 'employeeSkills' })
  employeeSkills: EmployeeSkills[];

  @HasMany(() => EmployeeEducation, {
    as: 'education',
    foreignKey: 'employeeId',
  })
  educationList: EmployeeEducation[];

  @HasMany(() => EmployeeExperience, {
    as: 'employeeExperience',
    foreignKey: 'employeeId',
  })
  employeeExperience: EmployeeExperience[];

  @HasMany(() => EmployeeJob, { as: 'employeeJobs', foreignKey: 'employeeId' })
  employeeJobs: EmployeeJob[];

  @BelongsTo(() => Location, { foreignKey: 'locationId', as: 'location' })
  location: Location;

  @HasMany(() => SuspiciousEmployee, { foreignKey: 'employeeId' })
  suspiciousEmployees: SuspiciousEmployee[];

  @HasMany(() => Swipe, { as: 'swipes' })
  swipes: Swipe[];

  @HasMany(() => EmployeePersonality, { as: 'employeePersonalities' })
  employeePersonalities: EmployeePersonality[];
}
