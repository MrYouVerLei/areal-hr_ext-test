import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileDto } from './dto/file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.delete(id);
  }

  @Post()
  create(@Body() fileDto: FileDto) {
    return this.filesService.create(fileDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() fileDto: FileDto
  ) {
    return this.filesService.update(id, fileDto);
  }
}
