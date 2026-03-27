import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionDto } from './dto/position.dto';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) { }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.delete(id);
  }

  @Post()
  create(@Body() positionDto: PositionDto) {
    return this.positionsService.create(positionDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() positionDto: PositionDto) {
    return this.positionsService.update(id, positionDto);
  }
}
