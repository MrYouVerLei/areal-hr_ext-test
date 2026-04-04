import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ChangelogsService } from './changelogs.service';
import { ChangelogDto } from './dto/changelog.dto';

@Controller('changelogs')
export class ChangelogsController {
  constructor(private readonly changelogsService: ChangelogsService) { }

  @Get()
  findAll() {
    return this.changelogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.changelogsService.findOne(id);
  }

  @Post()
  create(@Body() changelogDto: ChangelogDto) {
    return this.changelogsService.create(changelogDto);
  }
}
