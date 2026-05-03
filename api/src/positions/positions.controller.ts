import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionDto } from './dto/position.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { CheckAbilities } from '../casl/abilities.decorator';
import { Action } from '../casl/action.enum';
import { User } from '../users/user.decorator';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.findOne(id);
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Delete, subject: 'Position' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,
    @Query('date') date?: string,
  ) {
    return this.positionsService.delete(id, userId, date);
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Create, subject: 'Position' })
  @Post()
  create(@Body() positionDto: PositionDto, @User() userId: number) {
    return this.positionsService.create(positionDto, userId);
  }

  @Roles(Role.Admin)
  @CheckAbilities({ action: Action.Update, subject: 'Position' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() positionDto: PositionDto,
    @User() userId: number,
  ) {
    return this.positionsService.update(id, positionDto, userId);
  }
}
