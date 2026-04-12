import { Global, Module } from '@nestjs/common';
import { ChangelogsService } from './changelogs.service';

@Global()
@Module({
  providers: [ChangelogsService],
  exports: [ChangelogsService],
})
export class ChangelogsModule {}
