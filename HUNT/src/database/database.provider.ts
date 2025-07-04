// NPM modules
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/models/user.entity';
// Configs
import Config from './../config/index';
import { Employer } from 'src/models/employer.entity';
import { Job } from 'src/models/job.entity';
import { EmployerMedia } from 'src/models/employerMedia.entity';
import { JobPersonalities } from 'src/models/jobPersonality.entity';
import { Personality } from 'src/models/personality.entity';
import { Employee } from 'src/models/employee.entity';
import { EmployeeMedia } from 'src/models/employeeMedia.entity';
import { Location } from 'src/models/location.entity';
import { EmployeeEducation } from 'src/models/employeeEducation.entity';
import { EmployeeJob } from 'src/models/employeeJob.entity';
import { IndustryJobTitle } from 'src/models/industryJobTitle.entity';
import { Role } from 'src/models/roles.entity';
import { UserRole } from 'src/models/userRoles.entity';
import { Skill } from 'src/models/skills.entity';
import { JobSkills } from 'src/models/jobSkills.entity';
import { EmployeeRating } from 'src/models/employeeRating.entity';
import { SuspiciousEmployee } from 'src/models/suspiciousEmployee.entity';
import { EmployerAward } from 'src/models/employerAwards.entity';
import { EmployeeExperience } from 'src/models/employeeExperience.entity';
import { EmployeeSkills } from 'src/models/employeeSkills.entity';
import { CourseType } from 'src/models/courseType.entity';
import { JobEducation } from 'src/models/jobEducation.entity';
import { EmployerIndustry } from 'src/models/employerIndustry.entity';
import { Industry } from 'src/models/industry.entity';
import { Swipe } from 'src/models/swipe.entity';
import { EmployeePersonality } from 'src/models/employeePersonalities.entity';
import { EmployerDocument } from 'src/models/employerDocument.entity';
import { JobMedia } from 'src/models/jobMedia.entity';
import { ConfigTable } from 'src/models/configTable.entity';
import { Institute } from 'src/models/institute.entity';

// Models

const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      try {
        const sequelize = new Sequelize({
          dialect: 'mysql',
          host: Config.DB_HOST,
          port: Config.DB_PORT,
          username: Config.DB_USERNAME,
          password: Config.DB_PASSWORD,
          database: Config.DB_NAME,
          pool: {
            max: 10,
            min: 0,
            idle: 10000,
          },
          // logging: false,
          logging: function (str) {
            // do your own logging
            console.log('DB QUERY:', str);
          },
        });
        sequelize.addModels([
          User,
          Employer,
          Job,
          EmployerMedia,
          JobPersonalities,
          Personality,
          Employee,
          EmployeeMedia,
          Location,
          EmployeeEducation,
          EmployeeJob,
          IndustryJobTitle,
          Role,
          UserRole,
          JobSkills,
          Skill,
          EmployeeRating,
          SuspiciousEmployee,
          EmployerAward,
          EmployeeExperience,
          EmployeeSkills,
          JobEducation,
          CourseType,
          EmployerIndustry,
          Industry,
          Swipe,
          EmployeePersonality,
          EmployerDocument,
          JobMedia,
          ConfigTable,
          Institute,
        ]);
        return sequelize;
      } catch (e) {
        console.log('databaseProviders:error:', e);
        console.log('Exiting the app due to DB error');
        process.exit(1);
      }
    },
  },
];
export default databaseProviders;
