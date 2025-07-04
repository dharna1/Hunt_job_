import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Employee } from 'src/models/employee.entity';
import { EmployeeEducation } from 'src/models/employeeEducation.entity';
import { EmployeeJob } from 'src/models/employeeJob.entity';
import { EmployeeMedia } from 'src/models/employeeMedia.entity';
import { IndustryJobTitle } from 'src/models/industryJobTitle.entity';
import { Location } from 'src/models/location.entity';
import {
  CreateEmployeeRatingDto,
  ReportEmployeeDto,
} from './employee-dto/employee-dto';
import { EmployeeRating } from 'src/models/employeeRating.entity';
import { Sequelize } from 'sequelize-typescript';
import { SuspiciousEmployee } from 'src/models/suspiciousEmployee.entity';
import { EmployeeExperience } from 'src/models/employeeExperience.entity';
import { EmployeeSkills } from 'src/models/employeeSkills.entity';
import { Swipe } from 'src/models/swipe.entity';
import { Job } from 'src/models/job.entity';
import { EmployeePersonality } from 'src/models/employeePersonalities.entity';
import { Personality } from 'src/models/personality.entity';
import { Skill } from 'src/models/skills.entity';
import { Employer } from 'src/models/employer.entity';
import { Industry } from 'src/models/industry.entity';
import { JobSkills } from 'src/models/jobSkills.entity';
import { JobMedia } from 'src/models/jobMedia.entity';
import { Institute } from 'src/models/institute.entity';
import { CourseType } from 'src/models/courseType.entity';

const profileWeightage = {
  profilePhoto: 10,
  videoResume: 5,
  name: 5,
  profileDescription: 10,
  educationDetail: 5,
  experienceInfo: 10,
  resume: 10,
  keySkills: 10,
  yearOfExperience: 5,
  jobTitle: 5,
  industry: 10,
  location: 5,
  dateOfBirth: 5,
  personalities: 5,
};

@Injectable()
export class EmployeeService {
  constructor() {}

  async findAll(query: any): Promise<any> {
    const {
      employeeName,
      email,
      phoneNumber,
      experienceYear,
      accountStatus,
      createdOnStart,
      createdOnEnd,
      reported,
      search,
      sortDirection = 'DESC',
      pageNumber = 0,
      pageSize = 10,
    } = query;

    const where: any = {};

    // Filters
    if (employeeName) {
      where.employeeName = { [Op.like]: `%${employeeName}%` };
    }
    if (email) {
      where.email = { [Op.like]: `%${email}%` };
    }
    if (phoneNumber) {
      where.phoneNumber = { [Op.like]: `%${phoneNumber}%` };
    }
    if (experienceYear) {
      where.experienceYear = experienceYear;
    }
    if (accountStatus) {
      where.accountStatus = accountStatus;
    }
    if (reported) {
      where.reported = reported;
    }
    if (createdOnStart || createdOnEnd) {
      where.createdOn = {};
      if (createdOnStart) {
        where.createdOn[Op.gte] = new Date(createdOnStart);
      }
      if (createdOnEnd) {
        const endOfDay = new Date(createdOnEnd);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdOn[Op.lte] = endOfDay;
      }
    }

    // Search
    if (search) {
      where[Op.or] = [
        { employeeName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    // Pagination
    const pageNum = Number(pageNumber);
    const pageSz = Number(pageSize);
    const offset = pageNum * pageSz;

    // Query with sorting and pagination
    const employees = await Employee.findAndCountAll({
      where,
      order: [['createdOn', sortDirection]],
      limit: pageSz,
      offset: offset,
    });

    return {
      employees: employees.rows,
      totalItems: employees.count,
      currentPage: pageNum,
      totalPages: Math.ceil(employees.count / pageSz),
    };
  }

  async getEmployeeById(id: number): Promise<any> {
    return await Employee.findByPk(id, {
      include: [
        {
          model: EmployeeMedia,
          as: 'media',
          attributes: ['mediaId', 'position', 'url', 'thumbnail', 'mediaType'],
        },
        {
          model: EmployeeEducation,
          as: 'education',
          include: [
            {
              model: Institute,
              as: 'institute',
            },
            {
              model: CourseType,
              as: 'courseType',
            },
          ],
        },
        {
          model: EmployeeSkills,
          as: 'employeeSkills',
          include: [
            {
              model: Skill,
              as: 'skillList',
            },
          ],
        },
        {
          model: EmployeeExperience,
          as: 'employeeExperience',
        },
        {
          model: EmployeeJob,
          as: 'employeeJobs',
          attributes: ['position'],
          include: [
            {
              model: IndustryJobTitle,
              as: 'industryJobTitle',
              attributes: ['jobName'],
            },
            {
              model: Industry,
              as: 'industry',
              attributes: ['industryName'],
            },
          ],
        },
        {
          model: Location,
          as: 'location',
        },
        {
          model: EmployeePersonality,
          as: 'employeePersonalities',
          // attributes: ['position'],
          include: [
            {
              model: Personality,
              as: 'personalityDetails',
              attributes: ['personalityId', 'personality', 'active'],
            },
          ],
        },
      ],
    });
  }

  async updateEmployeePortfolio(
    employeeId: number,
    portfolioLink: string,
  ): Promise<Employee> {
    const employee = await Employee.findByPk(employeeId);
    employee.portfolioLink = portfolioLink;
    await employee.save();
    return employee;
  }

  async discoverEmployee(
    employeeId: number,
    discoverable: boolean,
  ): Promise<Employee> {
    const employee = await Employee.findByPk(employeeId);
    employee.discoverable = discoverable;
    await employee.save();
    return employee;
  }

  async rateEmployee(
    createEmployeeRatingDto: CreateEmployeeRatingDto,
  ): Promise<EmployeeRating> {
    const { employerId, employeeId, rating } = createEmployeeRatingDto;

    const employeeRating = new EmployeeRating({
      employerId,
      employeeId,
      rating,
    });
    await employeeRating.save();
    return employeeRating;
  }

  async getEmployeeRating(
    employeeId: number,
  ): Promise<{ avgRating: number; ratingCount: number }> {
    const result = await EmployeeRating.findOne({
      attributes: [
        [
          Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('rating'))),
          'avgRating',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('rating')), 'ratingCount'],
      ],
      where: { employeeId },
      raw: true,
    });

    return {
      avgRating: parseInt(result['avgRating'] || '0'),
      ratingCount: parseInt(result['ratingCount'] || '0'),
    };
  }

  async reportEmployee(
    employeeId: number,
    reportEmployeeDto: ReportEmployeeDto,
  ): Promise<SuspiciousEmployee> {
    const { employerId, reason } = reportEmployeeDto;
    const reportEmployee = new SuspiciousEmployee({
      employerId,
      employeeId,
      reason,
      reportedOn: new Date(),
    });
    await reportEmployee.save();
    return reportEmployee;
  }

  calculateCompleteness(employee) {
    let profileCompleted = 0;
    let missingDetails = 0;

    const hasImage = employee.media?.some(
      (media) => media.mediaType === 'IMAGE' && media.url !== '',
    );
    if (hasImage) {
      profileCompleted += profileWeightage.profilePhoto;
    } else {
      missingDetails++;
    }

    const hasVideoResume = employee.media?.some(
      (media) => media.mediaType === 'VIDEO' && media.url !== '',
    );
    if (hasVideoResume) {
      profileCompleted += profileWeightage.videoResume;
    } else {
      missingDetails++;
    }

    if (employee.employeeName) {
      profileCompleted += profileWeightage.name;
    } else {
      missingDetails++;
    }

    if (employee.description) {
      profileCompleted += profileWeightage.profileDescription;
    } else {
      missingDetails++;
    }

    if (employee.education?.length > 0) {
      profileCompleted += profileWeightage.educationDetail;
    } else {
      missingDetails++;
    }

    if (employee.employeeExperience?.length > 0) {
      profileCompleted += profileWeightage.experienceInfo;
    } else {
      missingDetails++;
    }

    if (employee.curriculumVitaeURL) {
      profileCompleted += profileWeightage.resume;
    } else {
      missingDetails++;
    }

    if (employee.employeeSkills?.length > 0) {
      profileCompleted += profileWeightage.keySkills;
    } else {
      missingDetails++;
    }

    if (employee?.experienceYear || employee?.experienceMonth) {
      profileCompleted += profileWeightage.yearOfExperience;
    } else {
      missingDetails++;
    }

    if (employee.employeeJobs.length > 0) {
      profileCompleted += profileWeightage.jobTitle;
    } else {
      missingDetails++;
    }

    if (employee.employeeJobs.length > 0) {
      profileCompleted += profileWeightage.industry;
    } else {
      missingDetails++;
    }

    if (employee?.locationId) {
      profileCompleted += profileWeightage.location;
    } else {
      missingDetails++;
    }

    if (employee.dateOfBirth) {
      profileCompleted += profileWeightage.dateOfBirth;
    } else {
      missingDetails++;
    }

    if (employee.employeePersonalities?.length > 0) {
      profileCompleted += profileWeightage.personalities;
    } else {
      missingDetails++;
    }

    employee.profileCompleted = profileCompleted;
    employee.missingDetails = missingDetails;
    return employee;
  }

  async getReportedEmployees(query: any): Promise<any> {
    const {
      employeeName,
      reported,
      search,
      pageNumber = 0,
      pageSize = 10,
    } = query;

    const where: any = {};

    // Filters
    if (employeeName) {
      where.employeeName = { [Op.like]: `%${employeeName}%` };
    }
    if (reported) {
      where.reported = { [Op.like]: `%${reported}%` };
    }
    if (search) {
      where[Op.or] = [{ employeeName: { [Op.like]: `%${search}%` } }];
    }
    const pageNum = Number(pageNumber);
    const pageSz = Number(pageSize);
    const offset = pageNum * pageSz;
    const employees = await SuspiciousEmployee.findAll({
      attributes: [
        'employeeId',
        [
          Sequelize.fn('COUNT', Sequelize.col('SuspiciousEmployee.employeeId')),
          'reportCount',
        ],
      ],
      include: [
        {
          model: Employee,
          attributes: [
            'employeeId',
            'employeeName',
            'email',
            'phoneNumber',
            'description',
            'reported',
          ],
          where,
        },
      ],
      group: ['SuspiciousEmployee.employeeId'],
      limit: pageSz,
      offset: offset,
    });

    // Count total distinct employees (not just reports)
    const totalItems = await SuspiciousEmployee.count({
      distinct: true,
      col: 'employeeId',
      include: [
        {
          model: Employee,
          where,
        },
      ],
    });

    return {
      employees: employees,
      totalItems: totalItems,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalItems / pageSz),
    };
  }

  async getReportedByEmployers(employeeId: number, query: any): Promise<any> {
    const { pageNumber = 0, pageSize = 10 } = query;
    const pageNum = Number(pageNumber);
    const pageSz = Number(pageSize);
    const offset = pageNum * pageSz;

    const reports = await SuspiciousEmployee.findAll({
      where: {
        employeeId: employeeId,
      },
      include: [
        {
          model: Employee,
          attributes: [
            'employeeId',
            'employeeName',
            'email',
            'phoneNumber',
            'description',
            'photoURL',
            'updatedOn',
          ],
        },
        {
          model: Employer,
          attributes: [
            'employerId',
            'employerName',
            'email',
            'phoneNumber',
            'organizationName',
            'organizationPhotoURL',
          ],
        },
      ],
      limit: pageSz,
      offset: offset,
    });

    const totalItems = await SuspiciousEmployee.count({
      where: {
        employeeId: employeeId,
      },
    });

    const formattedReports = reports.map((report) => ({
      employeeId: report.employeeId,
      employerId: report.employerId,
      reason: report.reason,
      reportedOn: report.reportedOn,
      employee: {
        employeeName: report.employee.employeeName,
        email: report.employee.email,
        phoneNumber: report.employee.phoneNumber,
        description: report.employee.description,
        photoURL: report.employee.photoURL,
        updatedOn: report.employee.updatedOn,
      },
      employer: {
        employerId: report.employer.employerId,
        employerName: report.employer.employerName,
        email: report.employer?.email,
        phoneNumber: report.employer?.phoneNumber,
        organizationName: report.employer?.organizationName,
        organizationPhotoURL: report.employer?.organizationPhotoURL,
      },
    }));

    return {
      reports: formattedReports,
      totalItems: totalItems,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalItems / pageSz),
    };
  }

  async blockEmployee(
    employeeId: number,
    reported: boolean,
  ): Promise<Employee> {
    const employee = await Employee.findByPk(employeeId);
    employee.reported = reported;
    await employee.save();
    return employee;
  }

  async findHotJobs(employeeId: string): Promise<any> {
    // Find active swipes for the employee
    const activeSwipes = await Swipe.findAll({
      where: {
        employeeId: employeeId,
        employeeSwipeTime: { [Op.is]: null },
        active: true,
      },
      include: [{ model: Job, as: 'job' }],
    });

    // Check if there are any active swipes
    if (activeSwipes.length === 0) {
      return [];
    }

    // Extract jobIds from the swipes and cast to number[]
    const jobIds = activeSwipes.map((swipe) => Number(swipe.jobId));

    // Find jobs based on those jobIds
    const hotJobs = await Job.findAll({
      where: {
        jobId: { [Op.in]: jobIds },
        status: 'live',
        active: true,
      },
      order: [['updatedOn', 'DESC']],
      limit: 20,
      include: [
        {
          model: Swipe,
          as: 'swipes',
          required: false,
          where: {
            employeeId: employeeId,
          },
          order: [['matchPercentage', 'DESC']],
        },
        {
          model: Employer,
          as: 'employer',
          attributes: ['organizationName'],
        },
        {
          model: JobSkills,
          as: 'jobSkills',
          include: [
            {
              model: Skill,
              as: 'skills',
            },
          ],
        },
        {
          model: JobMedia,
          as: 'media',
        },
        {
          model: Location,
          as: 'location',
          attributes: ['suburb', 'state', 'postcode'],
        },
      ],
    });

    if (hotJobs.length === 0) {
      return [];
    }

    return hotJobs;
  }

  async getEmployeeStatsWithMatchPercentage(employeeId: number) {
    // Step 1: Fetch the basic stats (perfectMatch, shortListed, and declined)
    const perfectMatch = await Swipe.count({
      where: {
        employeeId,
        employeeSwipe: 1,
        employerSwipe: 1,
      },
    });

    const shortListed = await Swipe.count({
      where: {
        employeeId,
        employerSwipe: 1,
      },
    });

    const declined = await Swipe.count({
      where: {
        employeeId,
        employerSwipe: -1,
      },
    });

    // Step 2: Fetch employee's job titles
    const employeeJobTitles = await EmployeeJob.findAll({
      where: { employeeId },
      attributes: ['jobTitleId'],
    });

    const employeeJobTitleIds = employeeJobTitles.map((job) =>
      Number(job.jobTitleId),
    );

    // Step 3: Fetch all jobs from SWIPE_0 for the same employee
    const swipedJobs = await Swipe.findAll({
      where: { employeeId },
      attributes: ['jobId', 'matchPercentage'],
    });

    const swipedJobIds = swipedJobs.map((job) => Number(job.jobId));

    // Step 4: Check how many jobs from `job_0` have the same `jobTitleId`
    await Job.findAll({
      where: {
        jobId: swipedJobIds,
        jobTitleId: employeeJobTitleIds,
      },
      attributes: ['jobId', 'jobTitleId'],
    });

    // Step 5: Group jobs by match percentage
    const highMatch = swipedJobs.filter((job) => job.matchPercentage > 75);
    const mediumMatch = swipedJobs.filter(
      (job) => job.matchPercentage > 40 && job.matchPercentage <= 75,
    );
    const lowMatch = swipedJobs.filter((job) => job.matchPercentage <= 40);

    // Step 6: Calculate the total number of swiped jobs
    const totalJobs = highMatch.length + mediumMatch.length + lowMatch.length;

    // If no jobs are found, return a default low reach
    if (totalJobs === 0) {
      return {
        perfectMatch,
        shortListed,
        declined,
        matchPercentage: {
          high: 0,
          medium: 0,
          low: 0,
        },
        overallReach: 'low', // Default if no jobs exist
      };
    }

    // Step 7: Calculate the weighted match percentage
    const weightedMatchPercentage =
      (highMatch.length * 1.0 +
        mediumMatch.length * 0.75 +
        lowMatch.length * 0.5) /
      totalJobs;

    // Step 8: Determine the overall reach based on the weighted percentage
    let overallReach = '';
    if (weightedMatchPercentage > 0.75) {
      overallReach = 'high';
    } else if (weightedMatchPercentage > 0.5) {
      overallReach = 'medium';
    } else {
      overallReach = 'low';
    }

    // Step 9: Return the final stats along with match percentages and overall reach
    return {
      perfectMatch,
      shortListed,
      declined,
      matchPercentage: {
        high: highMatch.length,
        medium: mediumMatch.length,
        low: lowMatch.length,
      },
      overallReach, // Based on the weighted match percentage
    };
  }

  async findUserById(id: any): Promise<any> {
    return Employee.findByPk(id);
  }

  async getEmployeeSwipedJobs(employeeId: number): Promise<any> {
    // Find active swipes for the employee
    const activeSwipes = await Swipe.findAll({
      where: {
        employeeId: employeeId,
        employeeSwipe: 1,
        active: true,
      },
      include: [{ model: Job, as: 'job' }],
    });

    // Check if there are any active swipes
    if (activeSwipes.length === 0) {
      return [];
    }

    // Extract jobIds from the swipes and cast to number[]
    const jobIds = activeSwipes.map((swipe) => Number(swipe.jobId));

    // Find jobs based on those jobIds
    const hotJobs = await Job.findAll({
      where: {
        jobId: { [Op.in]: jobIds },
        status: 'live',
        active: true,
      },
      order: [['updatedOn', 'DESC']],
      include: [
        {
          model: Swipe,
          as: 'swipes',
          attributes: ['employeeSwipe', 'employerSwipe'],
          required: false,
          where: {
            employeeId: employeeId,
          },
          order: [['matchPercentage', 'DESC']],
        },
        {
          model: Employer,
          as: 'employer',
          attributes: ['organizationName'],
        },
        {
          model: JobSkills,
          as: 'jobSkills',
          include: [
            {
              model: Skill,
              as: 'skills',
            },
          ],
        },
        {
          model: JobMedia,
          as: 'media',
        },
        {
          model: Location,
          as: 'location',
          attributes: ['suburb', 'state', 'postcode'],
        },
      ],
    });

    if (hotJobs.length === 0) {
      return [];
    }

    return hotJobs;
  }
}
