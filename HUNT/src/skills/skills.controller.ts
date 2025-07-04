import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppError } from 'src/utils/appError';
import { SkillsService } from './skills.service';
import { Response } from 'express';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillService: SkillsService) {}

  @Get()
  async getAllSkills(
    @Query('type') type: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const skills = await this.skillService.getSkills(type);
      res.status(200).json(skills);
    } catch (e) {
      console.error('Error fetching skills:', e);
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
