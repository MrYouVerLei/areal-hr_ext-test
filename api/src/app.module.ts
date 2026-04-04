import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigModule } from '@nestjs/config';
import { PositionsModule } from './positions/positions.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { PassportsModule } from './passports/passports.module';
import { AddressesModule } from './addresses/addresses.module';
import { HrOperationsModule } from './hr-operations/hr-operations.module';
import { UsersModule } from './users/users.module';
import { ChangelogsModule } from './changelogs/changelogs.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [DbModule, ConfigModule.forRoot({
    envFilePath: '../.env'
  }), OrganizationsModule, PositionsModule, DepartmentsModule, EmployeesModule, PassportsModule, AddressesModule, HrOperationsModule, UsersModule, ChangelogsModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
