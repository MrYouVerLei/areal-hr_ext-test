import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { CheckAbilities } from '../casl/abilities.decorator';
import { Action } from '../casl/action.enum';
import { Public } from '../auth/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Read, subject: 'User' }) // тест
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
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Put(':id')
  updateAll(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: CreateUserDto,
  ) {
    return this.usersService.updateAll(id, userDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, userDto);
  }
}
