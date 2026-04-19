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
import { OrganizationsService } from './organizations.service';
import { OrganizationDto } from './dto/organization.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.delete(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() organizationDto: OrganizationDto) {
    return this.organizationsService.create(organizationDto);
  }

  @Roles(Role.Admin)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() organizationDto: OrganizationDto,
  ) {
    return this.organizationsService.update(id, organizationDto);
  }
}
