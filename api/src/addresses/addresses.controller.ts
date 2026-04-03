import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressDto } from './dto/address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.delete(id);
  }

  @Post()
  create(@Body() addressDto: AddressDto) {
    return this.addressesService.create(addressDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() addressDto: AddressDto,
  ) {
    return this.addressesService.update(id, addressDto);
  }
}
