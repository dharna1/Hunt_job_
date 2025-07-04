import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { JobPersonalities } from './jobPersonality.entity';
import { Employer } from './employer.entity';
import { Location } from './location.entity';
import { IndustryJobTitle } from './industryJobTitle.entity';
import { JobSkills } from './jobSkills.entity';
import { JobEducation } from './jobEducation.entity';
import { Swipe } from './swipe.entity';
import { JobMedia } from './jobMedia.entity';

@Table({ tableName: 'JOB_0', timestamps: false })
export class Job extends Model<Job> {
  @Column({ primaryKey: true, autoIncrement: true })
  jobId: number;

  @Column
  industryId: number;

  @Column
  employerId: number;

  @Column
  jobTitleId: number;

  @Column({ allowNull: false })
  jobTitle: string;

  @Column
  locationId: number;

  @Column
  industryName: string;

  @Column
  description: string;

  @Column
  experienceRequired: number;

  @Column
  salary: number;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 1 })
  salaryProvided: number;

  @Column({
    type: DataType.ENUM('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
    defaultValue: null,
  })
  salaryPeriod: string;

  @Column({ type: DataType.TINYINT, defaultValue: 0 })
  active: boolean;

  @Column({
    type: DataType.ENUM('NoRequirement', 'FoundWithoutHunt', 'FoundWithHunt'),
    defaultValue: null,
  })
  closeReason: string;

  @Column({
    type: DataType.ENUM(
      'CASUAL',
      'PART_TIME',
      'FULL_TIME',
      'PERMANENT',
      'CONTRACT_BASED',
    ),
    defaultValue: null,
  })
  jobType: string;

  @Column({ defaultValue: false })
  ageRangeRequired: boolean;

  @Column
  ageRangeMinimum: number;

  @Column
  ageRangeMaximum: number;

  @Column
  noOfOpenings: bigint;

  @Column({ defaultValue: false })
  urgentJoiners: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  createdOn: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  updatedOn: Date;

  @Column
  minExperienceRequired: number;

  @Column({
    type: DataType.ENUM('draft', 'live', 'closed'),
    defaultValue: 'draft',
  })
  status: string;

  @BelongsTo(() => Employer, {
    foreignKey: 'employerId',
    as: 'employer',
  })
  employer: Employer;

  @BelongsTo(() => Location, {
    foreignKey: 'locationId',
    as: 'location',
  })
  location: Location;

  @BelongsTo(() => IndustryJobTitle, {
    foreignKey: 'jobTitleId',
    targetKey: 'jobTitleId',
    as: 'industryJobTitle',
  })
  industryJobTitle: IndustryJobTitle;

  @HasMany(() => JobPersonalities, {
    as: 'jobPersonalities',
    foreignKey: 'jobId',
  })
  jobPersonalities: JobPersonalities[];

  @HasMany(() => JobSkills, {
    as: 'jobSkills',
    foreignKey: 'jobId',
  })
  jobSkills: JobSkills[];

  @HasMany(() => JobEducation, {
    as: 'jobEducation',
    foreignKey: 'jobId',
  })
  jobEducation: JobEducation[];

  @HasMany(() => Swipe, { as: 'swipes' })
  swipes: Swipe[];

  @HasMany(() => JobMedia, {
    as: 'media',
    foreignKey: 'jobId',
  })
  media: JobMedia[];
}
