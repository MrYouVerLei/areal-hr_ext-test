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
import { MinioModule } from './minio/minio.module';
import { AuthModule } from './auth/auth.module';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { RolesGuard } from './guards/roles.guard';
import { CaslModule } from './casl/casl.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AbilitiesGuard } from './guards/abilities.guard';
import { RolesModule } from './roles/roles.module';
import { MultipleAuthorizeGuard } from './guards/multiple-authorize.guard';

@Module({
  imports: [
    DbModule,
    ChangelogsModule,
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    OrganizationsModule,
    PositionsModule,
    DepartmentsModule,
    EmployeesModule,
    PassportsModule,
    AddressesModule,
    HrOperationsModule,
    UsersModule,
    ChangelogsModule,
    FilesModule,
    MinioModule,
    AuthModule,
    CaslModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthenticatedGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: MultipleAuthorizeGuard,
    },
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AbilitiesGuard,
    // },
    // {
    //   provide: 'APP_GUARD',
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
