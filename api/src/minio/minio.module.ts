import { Module } from '@nestjs/common';
import { MINIO_TOKEN } from '../constants';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Module({
  exports: [MINIO_TOKEN],
  providers: [
    {
      inject: [ConfigService],
      provide: MINIO_TOKEN,
      useFactory: async (
        configService: ConfigService,
      ): Promise<Minio.Client> => {
        const client = new Minio.Client({
          endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
          port: 9000,
          accessKey: configService.getOrThrow('MINIO_USER'),
          secretKey: configService.getOrThrow('MINIO_PASSWORD'),
          useSSL: false,
        });
        return client;
      },
    },
  ],
})
export class MinioModule {}
