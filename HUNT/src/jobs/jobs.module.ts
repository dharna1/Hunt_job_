import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { EmployerService } from 'src/employer/employer.service';
import databaseProviders from 'src/database/database.provider';

@Module({
  controllers: [JobsController],
  providers: [JobsService, EmployerService, ...databaseProviders],
})
export class JobsModule {}
