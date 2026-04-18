import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileDto } from './dto/file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() fileDto: FileDto,
  ) {
    if (files.length == 0) {
      throw new BadRequestException('Файл не прикреплён');
    }
    return Promise.all(
      files.map((file) => this.filesService.create(file, fileDto)),
    );
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() fileDto: FileDto,
  ) {
    if (files.length == 0) {
      throw new BadRequestException('Файл не прикреплён');
    }
    return Promise.all(
      files.map((file) => this.filesService.update(id, file, fileDto)),
    );
  }
}
