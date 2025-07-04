import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';

@Module({
  imports: [DatabaseModule],
  providers: [EmployerService],
  controllers: [EmployerController],
})
export class EmployerModule {}
