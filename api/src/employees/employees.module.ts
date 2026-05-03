import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AddressesModule } from '../addresses/addresses.module';
import { PassportsModule } from '../passports/passports.module';

@Module({
  imports: [AddressesModule, PassportsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
