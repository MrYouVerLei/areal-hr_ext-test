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
import { CheckAbilities } from '../casl/abilities.decorator';
import { Action } from '../casl/action.enum';
import { User } from '../users/user.decorator';

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
  remove(@Param('id', ParseIntPipe) id: number, @User() userId: number) {
    return this.organizationsService.delete(id, userId);
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Create, subject: 'Organization' })
  @Post()
  create(@Body() organizationDto: OrganizationDto, @User() userId: number) {
    return this.organizationsService.create(organizationDto, userId);
  }

  @Roles(Role.Admin)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() organizationDto: OrganizationDto,
    @User() userId: number,
  ) {
    return this.organizationsService.update(id, organizationDto, userId);
  }
}
