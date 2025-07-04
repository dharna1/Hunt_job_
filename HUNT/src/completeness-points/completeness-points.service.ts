import { Injectable } from '@nestjs/common';
import {
  CompletenessPointsEnumEmployee,
  CompletenessPointsEnumEmployer,
} from 'src/enums/completenessPoints.enum';

@Injectable()
export class CompletenessPointsService {
  getAllCompletenessPointsForEmployee() {
    return [
      {
        field: 'profile photo',
        points: CompletenessPointsEnumEmployee.PROFILE_PHOTO,
      },
      {
        field: 'video resume',
        points: CompletenessPointsEnumEmployee.VIDEO_RESUME,
      },
      { field: 'name', points: CompletenessPointsEnumEmployee.NAME },
      {
        field: 'profile desc',
        points: CompletenessPointsEnumEmployee.PROFILE_DESC,
      },
      {
        field: 'education detail',
        points: CompletenessPointsEnumEmployee.EDUCATION_DETAIL,
      },
      { field: 'exp info', points: CompletenessPointsEnumEmployee.EXP_INFO },
      { field: 'resume', points: CompletenessPointsEnumEmployee.RESUME },
      {
        field: 'key skills',
        points: CompletenessPointsEnumEmployee.KEY_SKILLS,
      },
      {
        field: 'year of exp',
        points: CompletenessPointsEnumEmployee.YEAR_OF_EXP,
      },
      { field: 'job title', points: CompletenessPointsEnumEmployee.JOB_TITLE },
      { field: 'industry', points: CompletenessPointsEnumEmployee.INDUSTRY },
      { field: 'location', points: CompletenessPointsEnumEmployee.LOCATION },
    ];
  }

  getAllCompletenessPointsForEmployer() {
    return [
      {
        field: 'company name',
        points: CompletenessPointsEnumEmployer.COMPANY_NAME,
      },
      { field: 'about', points: CompletenessPointsEnumEmployer.ABOUT },
      { field: 'industry', points: CompletenessPointsEnumEmployer.INDUSTRY },
      { field: 'website', points: CompletenessPointsEnumEmployer.WEBSITE },
      {
        field: 'culture and benefits',
        points: CompletenessPointsEnumEmployer.CULTURE_AND_BENEFITS,
      },
      { field: 'awards', points: CompletenessPointsEnumEmployer.AWARDS },
      {
        field: 'profile photo',
        points: CompletenessPointsEnumEmployer.PROFILE_PHOTO,
      },
      {
        field: 'company location',
        points: CompletenessPointsEnumEmployer.COMPANY_LOCATION,
      },
    ];
  }
}
