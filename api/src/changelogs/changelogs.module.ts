import { Module } from '@nestjs/common';
import { ChangelogsService } from './changelogs.service';
import { ChangelogsController } from './changelogs.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ChangelogsController],
  providers: [ChangelogsService],
})
export class ChangelogsModule {}
