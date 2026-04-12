import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MinioModule } from '../minio/minio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, MinioModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
