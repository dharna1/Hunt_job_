import { Module } from '@nestjs/common';
import { CompletenessPointsService } from './completeness-points.service';
import { CompletenessPointsController } from './completeness-points.controller';

@Module({
  controllers: [CompletenessPointsController],
  providers: [CompletenessPointsService],
})
export class CompletenessPointsModule {}
