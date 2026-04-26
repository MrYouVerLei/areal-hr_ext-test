import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() permissionDto: PermissionDto) {
    return this.permissionsService.create(permissionDto);
  }

  @Roles(Role.Admin)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() permissionDto: PermissionDto,
  ) {
    return this.permissionsService.update(id, permissionDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.delete(id);
  }
}
