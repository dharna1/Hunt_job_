import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEmployerDto {
  @IsOptional()
  @IsString()
  employerName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  organizationName?: string;

  @IsOptional()
  @IsString()
  organizationPhotoURL?: string;

  @IsOptional()
  @IsString()
  organizationCulture?: string;

  @IsOptional()
  @IsString()
  organizationBenefits?: string;

  @IsOptional()
  totalEmployees?: bigint;

  @IsOptional()
  @IsString()
  organizationHeadline?: string;

  @IsOptional()
  @IsString()
  organizationAddress?: string;

  @IsOptional()
  @IsString()
  organizationWebsite?: string;

  @IsOptional()
  @IsString()
  organizationEmail?: string;
}

export class EmployerDocumentDto {
  @IsNotEmpty({ message: 'employer DocUrl is required' })
  @IsString()
  employerDocUrl: string;

  @IsOptional()
  @IsString()
  documentName: string;

  @IsNotEmpty({ message: 'Media type is required' })
  @IsString()
  mediaType: string;
}
