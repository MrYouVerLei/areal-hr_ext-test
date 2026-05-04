import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChangelogsService } from './changelogs.service';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { CheckAbilities } from '../casl/abilities.decorator';
import { Action } from '../casl/action.enum';

@Controller('changelogs')
export class ChangelogsController {
  constructor(private readonly changelogsService: ChangelogsService) {}

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Read, subject: 'Changelog' })
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

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Read, subject: 'Changelog' })
  @Get('objects')
  findAllTypeObjects() {
    return this.changelogsService.findAllTypeObjects();
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Read, subject: 'Changelog' })
  @Get('fields')
  findAllFields() {
    return this.changelogsService.findAllFields();
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Read, subject: 'Changelog' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.changelogsService.findOne(id);
  }
}
