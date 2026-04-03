import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeDto } from './dto/employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.delete(id);
  }

  @Post()
  create(@Body() employeeDto: EmployeeDto) {
    return this.employeesService.create(employeeDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() employeeDto: EmployeeDto
  ) {
    return this.employeesService.update(id, employeeDto);
  }
}
