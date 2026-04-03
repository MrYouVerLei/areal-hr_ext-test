import { Module } from '@nestjs/common';
import { PassportsService } from './passports.service';
import { PassportsController } from './passports.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PassportsController],
  providers: [PassportsService],
  exports: [PassportsService]
})
export class PassportsModule {}
