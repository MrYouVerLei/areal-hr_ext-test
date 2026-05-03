import { Module } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { HrOperationsController } from './hr-operations.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [EmployeesModule],
  controllers: [HrOperationsController],
  providers: [HrOperationsService],
  exports: [HrOperationsService],
})
export class HrOperationsModule {}
