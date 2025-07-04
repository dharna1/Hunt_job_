import { Controller, Get, Res } from '@nestjs/common';
import { CompletenessPointsService } from './completeness-points.service';
import { Response } from 'express';

@Controller('completeness-points')
export class CompletenessPointsController {
  constructor(
    private readonly completenessService: CompletenessPointsService,
  ) {}

  @Get('employee')
  async getAllCompletenessPointsForEmployee(@Res() res: Response) {
    const points =
      this.completenessService.getAllCompletenessPointsForEmployee();
    return res.status(200).json({ points });
  }

  @Get('employer')
  async getAllCompletenessPointsForEmployer(@Res() res: Response) {
    const points =
      this.completenessService.getAllCompletenessPointsForEmployer();
    return res.status(200).json({ points });
  }
}
