import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DbModule, ConfigModule.forRoot({
    envFilePath: '../.env'
  }), OrganizationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
