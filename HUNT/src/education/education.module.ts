import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
