import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AppError } from 'src/utils/appError';
import validatorHelper from 'src/utils/validator.helper';
import { Response } from 'express';
import {
  CreateEmployeeRatingDto,
  ReportEmployeeDto,
} from './employee-dto/employee-dto';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('employee')
@UseGuards(RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get()
  async getAllEmployees(
    @Res() res: Response,
    @Query() query: any,
  ): Promise<any> {
    try {
      const employeeList = await this.employeeService.findAll(query);
      res.status(200).json({
        employees: employeeList.employees,
        totalItems: employeeList.totalItems,
        currentPage: employeeList.currentPage,
        totalPages: employeeList.totalPages,
      });
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

  @Get('reportedEmployees')
  async getReportedEmployees(
    @Res() res: any,
    @Query() query: any,
  ): Promise<any> {
    try {
      const data = await this.employeeService.getReportedEmployees(query);
      return res.status(200).json({
        employees: data.employees,
        totalItems: data.totalItems,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error('employeeReporting -> error:', error);
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

  @Get('reportedEmployees/:employeeId')
  async getReportedByEmployers(
    @Res() res: any,
    @Param('employeeId') employeeId: number,
    @Query() query: any,
  ): Promise<any> {
    try {
      const data = await this.employeeService.getReportedByEmployers(
        employeeId,
        query,
      );
      return res.status(200).json({
        data: data.reports,
        totalItems: data.totalItems,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error('getReportedByEmployers -> error:', error);
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

  @Post('rating')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async rateEmployee(
    @Body() createEmployeeRatingDto: CreateEmployeeRatingDto,
    @Res() res: Response,
  ) {
    try {
      const employeeRating = await this.employeeService.rateEmployee(
        createEmployeeRatingDto,
      );
      return res.status(201).json(employeeRating);
    } catch (error) {
      console.error('employeeRating -> error:', error);
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

  @Get('/:employeeId')
  async getEmployeeById(
    @Param('employeeId') employeeId: string,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employeeId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employee not found'));
      }
      let employee = await this.employeeService.getEmployeeById(+employeeId);
      employee = employee.toJSON();
      employee = this.employeeService.calculateCompleteness(employee);
      return res.status(200).json(employee);
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

  @Get('/:employeeId/hotJobs')
  async getHotJobs(
    @Param('employeeId') employeeId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const lastModifiedJobs =
        await this.employeeService.findHotJobs(employeeId);
      return res.status(200).json({ jobs: lastModifiedJobs });
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

  @Put('/:employeeId/portfolio')
  async updateEmployeePortfolio(
    @Param('employeeId') employeeId: number,
    @Body('portfolioLink') portfolioLink: string,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employeeId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employee not found'));
      }
      if (validatorHelper.isNullOrUndefined(portfolioLink)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('Portfolio Link missing'));
      }
      const updatedEmployee =
        await this.employeeService.updateEmployeePortfolio(
          employeeId,
          portfolioLink,
        );
      return res.status(200).json(updatedEmployee);
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

  @Put('/:employeeId/discoverMe')
  async discoverEmployee(
    @Param('employeeId') employeeId: number,
    @Body('discoverable') discoverable: boolean,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employeeId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employee not found'));
      }
      const employee = await this.employeeService.discoverEmployee(
        employeeId,
        discoverable,
      );
      return res.status(200).json(employee.discoverable);
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

  @Get('/:employeeId/rating')
  async getEmployeeRating(
    @Param('employeeId') employeeId: number,
    @Res() res: Response,
  ) {
    try {
      const { avgRating, ratingCount } =
        await this.employeeService.getEmployeeRating(employeeId);
      return res.status(200).json({
        avgRating,
        ratingCount,
      });
    } catch (error) {
      console.error('employeeRating -> error:', error);
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

  @Post('/:employeeId/report')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async reportEmployee(
    @Param('employeeId') employeeId: number,
    @Body() reportEmployeeDto: ReportEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const reportEmployee = await this.employeeService.reportEmployee(
        employeeId,
        reportEmployeeDto,
      );

      return res.status(200).json(reportEmployee);
    } catch (error) {
      console.error('employeeReporting -> error:', error);
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

  @Put('/:employeeId/block')
  @Roles('ADMIN', 'SUPER_ADMIN')
  async blockEmployee(
    @Param('employeeId') employeeId: number,
    @Body('reported') reported: boolean,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employeeId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employee not found'));
      }
      const employee = await this.employeeService.blockEmployee(
        employeeId,
        reported,
      );
      return res.status(200).json(employee.reported);
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

  @Get('/:employeeId/stats')
  async getEmployeeStats(
    @Param('employeeId') employeeId: number,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employeeId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employee not found'));
      }
      const employeeStats =
        await this.employeeService.getEmployeeStatsWithMatchPercentage(
          employeeId,
        );

      return res.status(200).json(employeeStats);
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

  @Get('/:employeeId/swipedjobs')
  async getEmployeeSwipedjobs(
    @Param('employeeId') employeeId: number,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employeeId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employee not found'));
      }
      const employeeStats =
        await this.employeeService.getEmployeeSwipedJobs(employeeId);

      return res.status(200).json(employeeStats);
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
}
