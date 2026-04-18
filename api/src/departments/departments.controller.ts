import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentDto } from './dto/department.dto';

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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.delete(id);
  }

  @Post()
  create(@Body() departmentDto: DepartmentDto) {
    return this.departmentsService.create(departmentDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() departmentDto: DepartmentDto,
  ) {
    return this.departmentsService.update(id, departmentDto);
  }
}
