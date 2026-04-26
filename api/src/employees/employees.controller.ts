import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeDto } from './dto/employee.dto';
import { CheckAbilities } from '../casl/abilities.decorator';
import { Action } from '../casl/action.enum';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@Query('name') name?: string) {
    return this.employeesService.findAll(name);
  }

  @Get('detail')
  findAllDetail(
    @Query('name') name?: string,
    @Query('department', new ParseIntPipe({ optional: true }))
    department_id?: number,
    @Query('position', new ParseIntPipe({ optional: true }))
    position_id?: number,
  ) {
    return this.employeesService.findAllDetail(
      name,
      department_id,
      position_id,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Get('detail/:id')
  findOneDetail(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOneDetail(id);
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
    @Body() employeeDto: EmployeeDto,
  ) {
    return this.employeesService.update(id, employeeDto);
  }
}
