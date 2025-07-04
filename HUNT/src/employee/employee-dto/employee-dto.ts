import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ReportReason } from 'src/enums/reportReason.enum';

export class CreateEmployeeRatingDto {
  @IsNotEmpty({ message: 'Employer ID is required' })
  employerId: number;

  @IsNotEmpty({ message: 'Employee ID is required' })
  employeeId: number;

  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not be more than 5' })
  rating: number;
}

export class ReportEmployeeDto {
  @IsNotEmpty({ message: 'Employer ID is required' })
  employerId: number;

  // @IsEnum(ReportReason)
  @IsNotEmpty({ message: 'Report Reason is required' })
  reason: ReportReason;
}
export class ReportedEmployeeDTO {
  id: bigint;
  employerId: bigint;
  employeeId: bigint;
  reason: string;
  reportedOn: Date;
  employee: {
    employeeName: string;
    email: string;
    phoneNumber: string;
    description: string;
  };
}
