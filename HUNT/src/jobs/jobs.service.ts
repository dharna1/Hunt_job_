import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { JobPersonalities } from 'src/models/jobPersonality.entity';
import { EmployerMedia } from 'src/models/employerMedia.entity';
import { Job } from 'src/models/job.entity';
import { Personality } from 'src/models/personality.entity';
import { Location } from 'src/models/location.entity';
import { Employer } from 'src/models/employer.entity';
import { IndustryJobTitle } from 'src/models/industryJobTitle.entity';
import { CreateJobDto, UpdateJobDto } from './jobs-dto/jobs-dto';
import * as crypto from 'crypto';
import { JobSkills } from 'src/models/jobSkills.entity';
import { Skill } from 'src/models/skills.entity';
import { EmployerAward } from 'src/models/employerAwards.entity';
import { JobEducation } from 'src/models/jobEducation.entity';
import { CourseType } from 'src/models/courseType.entity';
import { EmployerIndustry } from 'src/models/employerIndustry.entity';
import { Industry } from 'src/models/industry.entity';
import { Employee } from 'src/models/employee.entity';
import { Swipe } from 'src/models/swipe.entity';
import { JobMedia } from 'src/models/jobMedia.entity';
import { EmployeeEducation } from 'src/models/employeeEducation.entity';
import { EmployeeExperience } from 'src/models/employeeExperience.entity';
import { EmployeeJob } from 'src/models/employeeJob.entity';

@Injectable()
export class JobsService {
  async findAll(query: any): Promise<any> {
    const {
      jobTitle,
      industryName,
      jobType,
      status,
      employerId,
      createdOnStart,
      createdOnEnd,
      search,
      sortDirection = 'DESC',
      pageNumber = 0,
      pageSize = 10,
    } = query;

    const where: any = {};

    // Filters
    if (jobTitle) where.jobTitle = { [Op.like]: `%${jobTitle}%` };
    if (industryName) where.industryName = { [Op.like]: `%${industryName}%` };
    if (jobType) where.jobType = { [Op.like]: `%${jobType}%` };
    if (status) where.status = status;
    if (employerId) where.employerId = employerId;

    if (createdOnStart || createdOnEnd) {
      where.createdOn = {};
      if (createdOnStart) where.createdOn[Op.gte] = new Date(createdOnStart);
      if (createdOnEnd) {
        const endOfDay = new Date(createdOnEnd);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdOn[Op.lte] = endOfDay;
      }
    }

    // Search
    if (search) {
      where[Op.or] = [
        { jobTitle: { [Op.like]: `%${search}%` } },
        { industryName: { [Op.like]: `%${industryName}%` } },
        { jobType: { [Op.like]: `%${jobType}%` } },
      ];
    }

    // Pagination
    const pageNum = Number(pageNumber);
    const pageSz = Number(pageSize);
    const offset = pageNum * pageSz;

    // Query with sorting and pagination
    const jobs = await Job.findAndCountAll({
      where,
      order: [['createdOn', sortDirection]],
      limit: pageSz,
      offset: offset,
      include: [
        {
          model: JobMedia,
          as: 'media',
        },
        {
          model: JobPersonalities,
          as: 'jobPersonalities',
          attributes: ['position', 'personalities'],
        },
        {
          model: JobEducation,
          as: 'jobEducation',
          attributes: ['courseId'],
        },
        {
          model: JobSkills,
          as: 'jobSkills',
          attributes: ['skillId'],
          include: [
            {
              model: Skill,
              as: 'skills',
              attributes: ['type'],
            },
          ],
        },
        {
          model: Location,
          as: 'location',
        },
      ],
    });

    // Transform job results
    const transformedJobs = jobs.rows.map((job) => {
      const activeSkills = [];
      const softSkills = [];

      job.jobSkills.forEach((jobSkill) => {
        // Assert that jobSkill.skills is of type Skill
        const skill = jobSkill.skills as any as Skill;
        if (skill) {
          if (skill.type === 'ACTIVE') {
            activeSkills.push(jobSkill.skillId);
          } else if (skill.type === 'SOFT') {
            softSkills.push(jobSkill.skillId);
          }
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { jobSkills, ...jobWithoutSkills } = job.toJSON();

      return {
        ...jobWithoutSkills,
        activeSkills,
        softSkills,
      };
    });
    const totalItems = await Job.count({ where });
    return {
      jobs: transformedJobs,
      totalItems: totalItems,
      currentPage: pageNum,
      totalPages: Math.ceil(totalItems / pageSz),
    };
  }

  async getJobById(id: number): Promise<any> {
    return await Job.findByPk(id, {
      include: [
        {
          model: JobPersonalities,
          as: 'jobPersonalities',
          attributes: ['position', 'personalities'],
          include: [
            {
              model: Personality,
              as: 'personalityDetails',
              attributes: ['personalityId', 'personality', 'active'],
            },
          ],
        },
        {
          model: IndustryJobTitle,
          as: 'industryJobTitle',
        },
        {
          model: Location,
          as: 'location',
        },
        {
          model: Employer,
          as: 'employer',
          include: [
            {
              model: EmployerMedia,
              as: 'media',
              attributes: [
                'mediaId',
                'position',
                'url',
                'thumbnail',
                'mediaType',
              ],
            },
            {
              model: EmployerAward,
              as: 'awards',
            },
            {
              model: EmployerIndustry,
              as: 'employerIndustry',
              include: [
                {
                  model: Industry,
                  as: 'industry',
                },
              ],
            },
          ],
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
          model: JobEducation,
          as: 'jobEducation',
          include: [
            {
              model: CourseType,
              as: 'courseType',
            },
          ],
        },
        {
          model: JobMedia,
          as: 'media',
        },
      ],
    });
  }

  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    const { media, personalities, skills, courseType, ...jobData } =
      createJobDto;
    jobData.closeReason =
      jobData.closeReason === '' ? null : jobData.closeReason;
    jobData.salaryPeriod =
      jobData.salaryPeriod === '' ? null : jobData.salaryPeriod;
    const industry = await this.findIndustryById(jobData.industryId);
    jobData.industryName = industry.industryName;
    const job = new Job({
      ...jobData,
      createdOn: new Date(),
      updatedOn: new Date(),
      jobId: createJobDto.jobId,
    });
    await job.save();
    // const personalities = createJobDto.personalities;
    // const skills = createJobDto.skills;
    // const courseType = createJobDto.courseType;
    if (personalities && personalities.length > 0) {
      const limitedPersonalities = personalities.slice(0, 3);

      const jobPersonalitiesEntries = limitedPersonalities.map(
        (personality, index) => ({
          jobId: job.jobId,
          position: index,
          personalities: personality,
        }),
      );

      await JobPersonalities.bulkCreate(jobPersonalitiesEntries);
    }

    if (skills && skills.length > 0) {
      const jobSkillsEntries = skills.map((skillId) => ({
        jobId: job.jobId,
        skillId: skillId,
      }));
      await JobSkills.bulkCreate(jobSkillsEntries);
    }
    if (courseType && courseType.length > 0) {
      const jobEducationEntries = courseType.map((courseId) => ({
        jobId: job.jobId,
        courseId: courseId,
      }));
      await JobEducation.bulkCreate(jobEducationEntries);
    }
    if (media && media.length > 0) {
      const jobMediaEntries = media.map((mediaItem, index) => ({
        jobId: job.jobId,
        position: index,
        mediaId: mediaItem.mediaId,
        url: mediaItem.url,
        thumbnail: mediaItem.thumbnail,
        mediaType: mediaItem.mediaType,
      }));
      await JobMedia.bulkCreate(jobMediaEntries);
    }
    return job;
  }

  async generateRandomNumericId(length: number): Promise<number> {
    let uniqueId: number;
    let isUnique = false;

    while (!isUnique) {
      const randomNumber = parseInt(
        crypto.randomBytes(length).toString('hex'),
        16,
      );
      uniqueId = Math.abs(randomNumber) % Math.pow(10, length);
      const existingJob = await this.findJobById(uniqueId);
      isUnique = !existingJob;
    }
    return uniqueId;
  }

  async updateJob(jobId: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const { media, personalities, skills, courseType, ...jobData } =
      updateJobDto;
    const job = await Job.findByPk(jobId);
    Object.assign(job, {
      ...jobData,
      updatedOn: new Date(),
    });

    await job.save();
    // const personalities = updateJobDto.personalities;
    if (personalities && personalities.length > 0) {
      await JobPersonalities.destroy({ where: { jobId: job.jobId } });
      const limitedPersonalities = personalities.slice(0, 3);

      const jobPersonalitiesEntries = limitedPersonalities.map(
        (personality, index) => ({
          jobId: job.jobId,
          position: index,
          personalities: personality,
        }),
      );
      await JobPersonalities.bulkCreate(jobPersonalitiesEntries);
    }
    // const skills = updateJobDto.skills;
    if (skills && skills.length > 0) {
      await JobSkills.destroy({ where: { jobId: job.jobId } });
      const jobSkillsEntries = skills.map((skillId) => ({
        jobId: job.jobId,
        skillId: skillId,
      }));
      await JobSkills.bulkCreate(jobSkillsEntries);
    }

    // const courseType = updateJobDto.courseType;
    if (courseType && courseType.length > 0) {
      await JobEducation.destroy({ where: { jobId: job.jobId } });
      const jobEducationEntries = courseType.map((courseId) => ({
        jobId: job.jobId,
        courseId: courseId,
      }));
      await JobEducation.bulkCreate(jobEducationEntries);
    }
    if (media && media.length > 0) {
      const existingMedia = await JobMedia.findAll({
        where: { jobId: job.jobId },
      });
      const newPosition = existingMedia.length;
      const jobMediaEntries = media.map((mediaItem, index) => ({
        jobId: job.jobId,
        position: newPosition + index,
        mediaId: mediaItem.mediaId,
        url: mediaItem.url,
        thumbnail: mediaItem.thumbnail,
        mediaType: mediaItem.mediaType,
      }));
      await JobMedia.bulkCreate(jobMediaEntries);
    }
    return job;
  }

  async updateJobStatus(jobId: number, status: string): Promise<any> {
    const job = await Job.findByPk(jobId);
    job.status = status;
    job.active = status === 'live';
    await job.save();
    return job;
  }

  async findJobById(id: any): Promise<Job> {
    return Job.findByPk(id);
  }

  getJobStatusEnum(): string[] {
    return ['draft', 'live', 'closed'];
  }

  async findActiveEmployeesForJob(jobId: string): Promise<any> {
    // Get active employees for the job
    const activeEmployees = await Swipe.findAll({
      where: {
        jobId: jobId,
        employerSwipeTime: { [Op.is]: null },
        active: true,
      },
      include: [{ model: Employee, as: 'employee' }],
    });

    // Check if any active employees were found
    if (activeEmployees.length === 0) {
      return [];
    }

    // Extract employeeIds from active employees
    const employeeIds = activeEmployees.map((swipe) => swipe.employeeId);
    // Get the last modified employees with the maximum match percentage
    const lastModifiedEmployees = await Employee.findAll({
      where: {
        employeeId: { [Op.in]: employeeIds },
        accountStatus: 'active',
        discoverable: true,
        reported: false,
      },
      order: [['updatedOn', 'DESC']],
      limit: 20,
      include: [
        {
          model: Swipe,
          as: 'swipes',
          required: false, // Use left join
          where: {
            jobId: jobId, // Ensure you match with jobId here
          },
          order: [['matchPercentage', 'DESC']], // Order by match percentage
        },
        {
          model: Location,
          as: 'location',
          attributes: ['suburb', 'state', 'postcode'],
        },
        {
          model: EmployeeEducation,
          as: 'education',
          attributes: ['year', 'description', 'acheivement'],
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
      ],
    });

    // Check if any employees were found
    if (lastModifiedEmployees.length === 0) {
      return [];
    }

    return lastModifiedEmployees;
  }

  async findIndustryById(id: any): Promise<Industry> {
    return Industry.findByPk(id);
  }

  async getSwipedEmployeesForJob(jobId: string): Promise<any> {
    // Get active employees for the job
    const activeEmployees = await Swipe.findAll({
      where: {
        jobId: jobId,
        employerSwipe: 1,
        active: true,
      },
      include: [{ model: Employee, as: 'employee' }],
    });

    // Check if any active employees were found
    if (activeEmployees.length === 0) {
      return [];
    }

    const employeeIds = activeEmployees.map((swipe) => swipe.employeeId);
    const lastModifiedEmployees = await Employee.findAll({
      where: {
        employeeId: { [Op.in]: employeeIds },
        accountStatus: 'active',
        discoverable: true,
        reported: false,
      },
      attributes: [
        'employeeName',
        'email',
        'phoneNumber',
        'gender',
        'photoURL',
        'profileHeadline',
        'experienceYear',
        'experienceMonth',
        'portfolioLink',
      ],
      order: [['updatedOn', 'DESC']],
      include: [
        {
          model: Swipe,
          as: 'swipes',
          required: false, // Use left join
          where: {
            jobId: jobId, // Ensure you match with jobId here
          },
          order: [['matchPercentage', 'DESC']], // Order by match percentage
        },
        {
          model: EmployeeEducation,
          as: 'education',
          attributes: ['year', 'description', 'acheivement'],
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
      ],
    });

    // Check if any employees were found
    if (lastModifiedEmployees.length === 0) {
      return [];
    }

    return lastModifiedEmployees;
  }
}
