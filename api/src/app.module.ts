import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigModule } from '@nestjs/config';
import { PositionsModule } from './positions/positions.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [DbModule, ConfigModule.forRoot({
    envFilePath: '../.env'
  }), OrganizationsModule, PositionsModule, DepartmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
