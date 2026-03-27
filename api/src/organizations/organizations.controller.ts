import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationDto } from './dto/organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.delete(id);
  }

  @Post()
  create(@Body() organizationDto: OrganizationDto) {
    return this.organizationsService.create(organizationDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() organizationDto: OrganizationDto) {
    return this.organizationsService.update(id, organizationDto);
  }
}
