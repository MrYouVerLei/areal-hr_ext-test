import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentDto } from './dto/department.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { CheckAbilities } from '../casl/abilities.decorator';
import { Action } from '../casl/action.enum';
import { User } from '../users/user.decorator';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get('tree/:id')
  findAllInOrganization(@Param('id', ParseIntPipe) organizationId: number) {
    return this.departmentsService.findAllInOrganization(organizationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Delete, subject: 'Department' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,
    @Query('date') date?: string,
  ) {
    return this.departmentsService.delete(id, userId, date);
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Create, subject: 'Department' })
  @Post()
  create(@Body() departmentDto: DepartmentDto, @User() userId: number) {
    return this.departmentsService.create(departmentDto, userId);
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Update, subject: 'Department' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() departmentDto: DepartmentDto,
    @User() userId: number,
  ) {
    return this.departmentsService.update(id, departmentDto, userId);
  }
}
