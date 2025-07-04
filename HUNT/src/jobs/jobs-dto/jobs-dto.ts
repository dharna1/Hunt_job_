import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty({ message: 'Employer ID is required.' })
  employerId: number;

  @IsOptional()
  jobId?: number;

  @IsNotEmpty({ message: 'Industry ID is required.' })
  industryId: number;

  @IsNotEmpty({ message: 'jobTitle ID is required.' })
  jobTitleId: number;

  @IsNotEmpty({ message: 'jobTitle is required.' })
  jobTitle: string;

  @IsNotEmpty({ message: 'locationId is required.' })
  locationId: number;

  @IsOptional()
  industryName: string;

  @IsOptional()
  description: string;

  @IsOptional()
  experienceRequired: number;

  @IsOptional()
  minExperienceRequired: number;

  @IsOptional()
  @IsNumber()
  salary: number;

  @IsOptional()
  @IsNumber()
  salaryProvided: number;

  @IsOptional()
  salaryPeriod: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  closeReason?: string;

  @IsNotEmpty({ message: 'Job Type is required.' })
  jobType: string;

  @IsOptional()
  @IsBoolean()
  ageRangeRequired: boolean;

  @IsOptional()
  @IsNumber()
  ageRangeMinimum: number;

  @IsOptional()
  @IsNumber()
  ageRangeMaximum: number;

  @IsOptional()
  @IsNumber()
  noOfOpenings: bigint;

  @IsOptional()
  @IsBoolean()
  urgentJoiners: boolean;

  @IsEnum(['draft', 'live', 'closed'], {
    message: 'Status must be one of the following: draft, live, closed',
  })
  status: string = 'draft';

  @IsArray()
  @IsNotEmpty({ message: 'Personalities are required.' })
  personalities: number[];

  @IsArray()
  @IsNotEmpty({ message: 'Active Skills are required.' })
  activeSkills: number[];

  @IsArray()
  @IsOptional()
  softSkills?: number[];

  @IsArray()
  @IsOptional()
  skills?: number[];

  @IsArray()
  @IsNotEmpty({ message: 'Course Type is required.' })
  courseType?: bigint[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
}

export class UpdateJobDto {
  @IsOptional()
  employerId: number;

  @IsOptional()
  industryId?: number;

  @IsOptional()
  jobTitleId?: number;

  @IsOptional()
  jobTitle?: string;

  @IsOptional()
  locationId?: number;

  @IsOptional()
  industryName?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  experienceRequired?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsNumber()
  salaryProvided?: number;

  @IsOptional()
  salaryPeriod?: string;

  @IsOptional()
  jobType?: string;

  @IsOptional()
  @IsBoolean()
  ageRangeRequired?: boolean;

  @IsOptional()
  @IsNumber()
  ageRangeMinimum?: number;

  @IsOptional()
  @IsNumber()
  ageRangeMaximum?: number;

  @IsOptional()
  minExperienceRequired: number;

  @IsOptional()
  @IsNumber()
  noOfOpenings?: bigint;

  @IsOptional()
  @IsBoolean()
  urgentJoiners?: boolean;

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ message: 'Personalities are required.' })
  personalities?: number[];

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ message: 'Active Skills are required.' })
  activeSkills?: number[];

  @IsArray()
  @IsOptional()
  softSkills?: number[];

  @IsArray()
  @IsOptional()
  skills?: number[];

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ message: 'Course Type is required.' })
  courseType?: bigint[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
}

class MediaDto {
  @IsNotEmpty()
  mediaId: number;

  @IsNotEmpty()
  mediaType: string;

  @IsOptional()
  thumbnail: string;

  @IsNotEmpty()
  url: string;
}
