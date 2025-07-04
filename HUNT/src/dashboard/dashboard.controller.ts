import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppError } from 'src/utils/appError';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/orgEmployeeStats')
  async getStats(@Res() res: Response, @Query() query: any): Promise<any> {
    try {
      const counts = await this.dashboardService.getCountByMonthAndYear(query);
      return res.status(200).json(counts);
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

  @Get('/orgEmployeeMonthlyStats')
  async getMonthlyStats(@Res() res: Response): Promise<any> {
    try {
      const stats =
        await this.dashboardService.getMonthlyStatsForLastFiveMonths();
      return res.status(200).json(stats);
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

  @Get('/reportedJobSeekerStats')
  async getReportedJobSeekerStats(
    @Res() res: Response,
    @Query() query: any,
  ): Promise<any> {
    try {
      const counts =
        await this.dashboardService.getReportedJobSeekerStats(query);
      return res.status(200).json(counts);
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

  @Get('/jobStats')
  async getJobStats(@Res() res: Response, @Query() query: any): Promise<any> {
    try {
      const counts = await this.dashboardService.getJobStats(query);
      return res.status(200).json(counts);
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

  @Get('/perfectMatchStats')
  async getPerfectMatchStats(
    @Res() res: Response,
    @Query() query: any,
  ): Promise<any> {
    try {
      const counts =
        await this.dashboardService.getPerfectMatchCountForMonth(query);
      return res.status(200).json(counts);
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
