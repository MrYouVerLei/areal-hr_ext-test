import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { HrOperationDto } from './dto/hr-operation.dto';

@Controller('hr-operations')
export class HrOperationsController {
  constructor(private readonly hrOperationsService: HrOperationsService) { }

  @Get()
  findAll() {
    return this.hrOperationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.delete(id);
  }

  @Post()
  create(@Body() hrOperationDto: HrOperationDto) {
    return this.hrOperationsService.create(hrOperationDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() hrOperationDto: HrOperationDto
  ) {
    return this.hrOperationsService.update(id, hrOperationDto);
  }
}
