import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.Admin)
  @Get('check-unique-login/:login')
  checkUniqueLogin(@Param('login') login: string) {
    return this.usersService.checkUniqueLogin(login);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() userDto: UserDto) {
    return this.usersService.create(userDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    return this.usersService.update(id, userDto);
  }
}
