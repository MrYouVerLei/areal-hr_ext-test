import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { HrOperationsModule } from '../hr-operations/hr-operations.module';

@Module({
  imports: [HrOperationsModule],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
