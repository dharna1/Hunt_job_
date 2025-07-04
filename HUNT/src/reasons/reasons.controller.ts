import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReasonsService } from './reasons.service';

@Controller('reasons')
export class ReasonsController {
  constructor(private readonly reasonService: ReasonsService) {}

  @Get()
  async getReportReasons(@Res() res: Response) {
    const reasons = await this.reasonService.getEnumValues();
    return res.status(200).json({ reasons });
  }
}
