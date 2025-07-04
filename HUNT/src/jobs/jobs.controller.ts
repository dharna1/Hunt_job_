import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppError } from 'src/utils/appError';
import { JobsService } from './jobs.service';
import { Response } from 'express';
import validatorHelper from 'src/utils/validator.helper';
import { CreateJobDto, UpdateJobDto } from './jobs-dto/jobs-dto';
import { EmployerService } from 'src/employer/employer.service';
import axios from 'axios';
import { JobMedia } from 'src/models/jobMedia.entity';
import { ConfigTable } from 'src/models/configTable.entity';
// import axios from 'axios';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly employerService: EmployerService,
  ) {}

  @Get()
  async getAllJobs(@Res() res: Response, @Query() query: any): Promise<any> {
    try {
      const jobList = await this.jobsService.findAll(query);
      res.status(200).json({
        jobs: jobList.jobs,
        totalItems: jobList.totalItems,
        currentPage: jobList.currentPage,
        totalPages: jobList.totalPages,
      });
    } catch (e) {
      console.error('Error fetching jobs:', e);
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createJob(@Body() createJobDto: CreateJobDto, @Res() res: Response) {
    try {
      const employerInfo = await this.employerService.findById(
        createJobDto.employerId,
      );
      if (!employerInfo) {
        return res
          .status(404)
          .json(new AppError(404).addDbError('Employer not found'));
      }
      if (employerInfo) {
        const skills = [
          ...(createJobDto.activeSkills || []),
          ...(createJobDto.softSkills || []),
        ];
        const jobId = await this.jobsService.generateRandomNumericId(10);
        const job = await this.jobsService.createJob({
          ...createJobDto,
          jobId,
          skills,
        });
        return res.status(200).json(job);
      }
    } catch (error) {
      console.error('employer -> error:', error);
      if (error instanceof AppError) {
        return res.status(error.getStatusCode()).json(error);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Get('/status')
  async getJobStatusEnum(@Res() res: Response) {
    try {
      const statuses = await this.jobsService.getJobStatusEnum();
      return res.status(200).json(statuses);
    } catch (error) {
      console.error('job -> error:', error);
      if (error instanceof AppError) {
        return res.status(error.getStatusCode()).json(error);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Get('/:jobId')
  async getJobById(@Param('jobId') jobId: string, @Res() res: Response) {
    try {
      if (validatorHelper.isNullOrUndefined(jobId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('Job not found'));
      }
      const job = await this.jobsService.getJobById(+jobId);
      const jobData = job.toJSON();

      const activeSkills = jobData.jobSkills
        ? jobData.jobSkills
            .filter((skill) => skill.skills.type === 'ACTIVE')
            .map((skill) => ({
              skillId: skill.skillId,
              name: skill.skills.name,
              jobTitleId: skill.skills.jobTitleId,
            }))
        : [];

      const softSkills = jobData.jobSkills
        ? jobData.jobSkills
            .filter((skill) => skill.skills.type === 'SOFT')
            .map((skill) => ({
              skillId: skill.skillId,
              name: skill.skills.name,
              jobTitleId: skill.skills.jobTitleId,
            }))
        : [];

      const updatedJob = {
        ...jobData,
        activeSkills,
        softSkills,
      };
      delete updatedJob.jobSkills;

      return res.status(200).json(updatedJob);
    } catch (error) {
      console.error('employee -> error:', error);
      if (error instanceof AppError) {
        return res.status(error.getStatusCode()).json(error);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Put('/:jobId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateJob(
    @Param('jobId') jobId: number,
    @Body() updateJobDto: UpdateJobDto,
    @Res() res: Response,
  ) {
    try {
      const job = await this.jobsService.findJobById(jobId);
      if (!job) {
        return res
          .status(404)
          .json(new AppError(404).addDbError('Job not found'));
      }
      if (job.status === 'live') {
        return res
          .status(404)
          .json(new AppError(404).addDbError('Job is live, can not update'));
      }

      const employerInfo = await this.employerService.findById(job.employerId);
      if (!employerInfo) {
        return res
          .status(404)
          .json(new AppError(404).addDbError('Employer not found'));
      }
      const skills = [
        ...(updateJobDto.activeSkills || []),
        ...(updateJobDto.softSkills || []),
      ];

      const updatedDto = { ...updateJobDto, skills };
      const updatedJob = await this.jobsService.updateJob(jobId, updatedDto);

      return res.status(200).json(updatedJob);
    } catch (error) {
      console.error('employee -> error:', error);
      if (error instanceof AppError) {
        return res.status(error.getStatusCode()).json(error);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Put('/:jobId/status')
  async updateJobStatus(
    @Param('jobId') jobId: number,
    @Body('status') status: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // const transaction = await this.sequelize.transaction();
    try {
      if (validatorHelper.isNullOrUndefined(jobId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('Job not found'));
      }

      if (!['draft', 'live', 'closed'].includes(status)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('Invalid status value'));
      }
      // Retrieve KYC_CHECK config value
      const kycCheckConfig = await ConfigTable.findOne({
        where: { configKey: 'KYC_CHECK' },
      });

      const jobInfo = await this.jobsService.findJobById(jobId);

      // Prevent setting the status to the same value as it currently is
      if (jobInfo.status === status) {
        return res
          .status(400)
          .json(
            new AppError(400).addDbError(`Job status is already ${status}`),
          );
      }

      // Only allow changing from "live" to "closed"
      if (jobInfo.status === 'live' && status !== 'closed') {
        return res
          .status(400)
          .json(
            new AppError(400).addDbError(
              `Cannot change status from live to ${status}`,
            ),
          );
      }
      if (jobInfo.status === 'closed') {
        return res
          .status(400)
          .json(
            new AppError(400).addDbError(
              `Cannot change status from closed to ${status}`,
            ),
          );
      }
      const employerInfo = await this.employerService.findById(
        jobInfo.employerId,
      );
      if (kycCheckConfig?.configValue === '1') {
        if (!employerInfo.approved) {
          return res
            .status(403)
            .json(new AppError(403).addDbError('Employer KYC not approved'));
        }
      }
      let jobUpdated;
      if (status === 'live') {
        const accessToken =
          req.headers['token'] || req.headers['authorization']?.split(' ')[1];
        const token = Array.isArray(accessToken) ? accessToken[1] : accessToken;
        const apiUrl = `${process.env.SWIPE_ENTRY_URL}/api/swipe/addJobScore/${jobId}?token=${token}`;
        jobUpdated = await this.jobsService.updateJobStatus(jobId, status);
        try {
          const swipeApiResponse = await axios.post(apiUrl, {});
          if (swipeApiResponse.status !== 200) {
            jobUpdated = await this.jobsService.updateJobStatus(
              jobId,
              jobInfo.status,
            );
            return res
              .status(500)
              .json(
                new AppError(500).addServerError(
                  `Failed to create entry in swipe table with endpoint ${apiUrl}`,
                ),
              );
          }
        } catch (swipeApiError) {
          await this.jobsService.updateJobStatus(jobId, jobInfo.status);
          console.error(
            'Swipe API Error:',
            swipeApiError.response?.data || swipeApiError.message,
          );
          return res
            .status(500)
            .json(
              new AppError(500).addServerError(
                `Failed to create entry in swipe table with endpoint ${apiUrl} (not entered)`,
              ),
            );
        }
      } else {
        jobUpdated = await this.jobsService.updateJobStatus(jobId, status);
      }
      return res.status(200).json({ success: true, status: jobUpdated.status });
    } catch (error) {
      console.error('job -> error:', error);
      if (error instanceof AppError) {
        return res.status(error.getStatusCode()).json(error);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Get('/:jobId/activeEmployees')
  async getActiveEmployeesForJob(
    @Param('jobId') jobId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const lastModifiedEmployees =
        await this.jobsService.findActiveEmployeesForJob(jobId);
      return res.status(200).json({ employees: lastModifiedEmployees });
    } catch (e) {
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Delete(':jobId/media/:mediaId')
  async deleteJobMedia(
    @Param('jobId') jobId: number,
    @Param('mediaId') mediaId: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const job = await this.jobsService.findJobById(jobId);
      if (validatorHelper.isNullOrUndefined(job)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('Job not found'));
      }
      const result = await JobMedia.destroy({
        where: {
          jobId: jobId,
          mediaId: mediaId,
        },
      });

      if (result === 0) {
        return res
          .status(400)
          .json(
            new AppError(400).addDbError('Media not found or already deleted'),
          );
      }
      return res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
      console.error('job -> error:', error);
      if (error instanceof AppError) {
        return res.status(error.getStatusCode()).json(error);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Get('/:jobId/swipedEmployees')
  async getSwipedEmployeesForJob(
    @Param('jobId') jobId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const lastModifiedEmployees =
        await this.jobsService.getSwipedEmployeesForJob(jobId);
      return res.status(200).json({ employees: lastModifiedEmployees });
    } catch (e) {
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }
}
