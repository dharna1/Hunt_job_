import { Module } from '@nestjs/common';
import { ReasonsService } from './reasons.service';
import { ReasonsController } from './reasons.controller';

@Module({
  providers: [ReasonsService],
  controllers: [ReasonsController],
})
export class ReasonsModule {}
