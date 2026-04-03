import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { DbModule } from 'src/db/db.module';
import { AddressesModule } from 'src/addresses/addresses.module';
import { PassportsModule } from 'src/passports/passports.module';

@Module({
  imports: [DbModule, AddressesModule, PassportsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
