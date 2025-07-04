import {
  Body,
  Controller,
  Delete,
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
import { EmployerService } from './employer.service';
import validatorHelper from 'src/utils/validator.helper';
import { AppError } from 'src/utils/appError';
import { Response } from 'express';
import {
  EmployerDocumentDto,
  UpdateEmployerDto,
} from './employer-dto/employer-dto';
import { EmployerDocument } from 'src/models/employerDocument.entity';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('employer')
@UseGuards(RolesGuard)
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get()
  async getAllEmployers(
    @Res() res: Response,
    @Query() query: any,
  ): Promise<any> {
    try {
      const employerList = await this.employerService.findAll(query);
      res.status(200).json({
        employers: employerList.employers,
        totalItems: employerList.totalItems,
        currentPage: employerList.currentPage,
        totalPages: employerList.totalPages,
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

  @Get('/:employerId')
  async getEmployerById(
    @Param('employerId') employerId: string,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employerId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer id not valid'));
      }
      const employerInfo = await this.employerService.findUserById(employerId);
      if (!employerInfo) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer not found'));
      }
      let employer = await this.employerService.findById(+employerId);
      employer = employer.toJSON();
      employer = this.employerService.calculateCompleteness(employer);
      return res.status(200).json(employer);
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

  @Put('/:employerId')
  async updateEmployerDetails(
    @Param('employerId') employerId: string,
    @Body() updateEmployerDto: UpdateEmployerDto,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employerId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer id not valid'));
      }
      const employerInfo = await this.employerService.findUserById(employerId);
      if (!employerInfo) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer not found'));
      }
      const updatedEmployer = await this.employerService.updateEmployerDetails(
        employerId,
        updateEmployerDto,
      );
      return res.status(200).json(updatedEmployer);
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

  @Put('/:employerId/approve')
  @Roles('ADMIN', 'SUPER_ADMIN')
  async approveEmployer(
    @Param('employerId') employerId: number,
    @Body('approved') approved: boolean,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employerId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer id not valid'));
      }
      const employerInfo = await this.employerService.findUserById(employerId);
      if (!employerInfo) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer not found'));
      }
      const employerApproved = await this.employerService.approveEmployer(
        employerId,
        approved,
      );
      return res.status(200).json(employerApproved.approved);
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

  @Post('/:employerId/kycDocs')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async uploadEmployerDocument(
    @Param('employerId') employerId: bigint,
    @Body() employerDocumentDto: EmployerDocumentDto,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employerId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer id not valid'));
      }
      const employerInfo = await this.employerService.findUserById(employerId);
      if (!employerInfo) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer not found'));
      }
      const document = await this.employerService.uploadDocument(
        employerId,
        'KYC',
        employerDocumentDto,
      );

      return res.status(200).json(document);
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

  @Post('/:employerId/cultureImages')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async uploadEmployerCultureImages(
    @Param('employerId') employerId: bigint,
    @Body() employerDocumentDto: EmployerDocumentDto,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employerId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer id not valid'));
      }
      const employerInfo = await this.employerService.findUserById(employerId);
      if (!employerInfo) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer not found'));
      }

      const document = await this.employerService.uploadDocument(
        employerId,
        'CULTURE',
        employerDocumentDto,
      );

      return res.status(200).json(document);
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

  @Get('/:employerId/documents')
  async getEmployerDocuments(
    @Param('employerId') employerId: bigint,
    @Query() query: any,
    @Res() res: Response,
  ) {
    try {
      if (validatorHelper.isNullOrUndefined(employerId)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer id not valid'));
      }
      const employerInfo = await this.employerService.findUserById(employerId);
      if (!employerInfo) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer not found'));
      }

      const documents = await this.employerService.getDocumentsByEmployerId(
        employerId,
        query,
      );

      return res.status(200).json(documents);
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

  @Delete(':employerId/documents/:employerDocId')
  async deleteEmployerDocs(
    @Param('employerId') employerId: number,
    @Param('employerDocId') employerDocId: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const employer = await this.employerService.findUserById(employerId);
      if (validatorHelper.isNullOrUndefined(employer)) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer id not valid'));
      }
      if (!employer) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('employer not found'));
      }
      const docInfo = await this.employerService.findDocById(employerDocId);
      if (docInfo.docType === 'KYC' && employer.approved) {
        return res
          .status(400)
          .json(
            new AppError(400).addDbError(
              'employer is verified , can not delete KYC Document',
            ),
          );
      }
      const result = await EmployerDocument.destroy({
        where: {
          employerId: employerId,
          employerDocId: employerDocId,
        },
      });

      if (result === 0) {
        return res
          .status(400)
          .json(
            new AppError(400).addDbError(
              'Document not found or already deleted',
            ),
          );
      }
      return res.status(200).json({ message: 'Document deleted successfully' });
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
}
