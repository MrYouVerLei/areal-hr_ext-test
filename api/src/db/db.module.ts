import { Global, Inject, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../constants';
import { ConfigService } from '@nestjs/config';

const dbProvider = {
  provide: PG_CONNECTION,
  useFactory: (configService: ConfigService) => {
    return new Pool({
      user: configService.get<string>('PGUSER'),
      host: configService.get<string>('PGHOST'),
      database: configService.get<string>('PGDATABASE'),
      password: configService.get<string>('PGPASSWORD'),
      port: configService.get<number>('PGPORT')
    })
  },
  inject: [ConfigService]
};

@Global()
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule { }
