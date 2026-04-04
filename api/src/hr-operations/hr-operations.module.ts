import { Module } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { HrOperationsController } from './hr-operations.controller';

@Module({
  controllers: [HrOperationsController],
  providers: [HrOperationsService],
})
export class HrOperationsModule {}
