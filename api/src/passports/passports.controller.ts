import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PassportsService } from './passports.service';
import { PassportDto } from './dto/passport.dto';

@Controller('passports')
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  @Get()
  findAll() {
    return this.passportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.passportsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.passportsService.delete(id);
  }

  @Post()
  create(@Body() passportDto: PassportDto) {
    return this.passportsService.create(passportDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() passportDto: PassportDto,
  ) {
    return this.passportsService.update(id, passportDto);
  }
}
