import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChangelogsService } from './changelogs.service';

@Controller('changelogs')
export class ChangelogsController {
  constructor(private readonly changelogsService: ChangelogsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('rowsPerPage') rowsPerPage: number = 10,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('object') object?: string,
    @Query('field') field?: string,
  ) {
    return this.changelogsService.findAll(
      page,
      rowsPerPage,
      from,
      to,
      object,
      field,
    );
  }

  @Get('objects')
  findAllTypeObjects() {
    return this.changelogsService.findAllTypeObjects();
  }

  @Get('fields')
  findAllFields() {
    return this.changelogsService.findAllFields();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.changelogsService.findOne(id);
  }
}
