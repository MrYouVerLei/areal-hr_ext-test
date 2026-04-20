import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { FileDto } from './dto/file.dto';
import * as Minio from 'minio';
import { InjectMinio } from '../minio/minio.decorator';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly bucketName: string;

  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    @InjectMinio() private readonly minioService: Minio.Client,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET') || 'files';
  }

  async getFile(filename: string) {
    return await this.minioService.presignedUrl(
      'GET',
      this.bucketName,
      filename,
    );
  }

  uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = `${randomUUID().toString()}-${file.originalname}`;
      this.minioService.putObject(
        this.bucketName,
        filename,
        file.buffer,
        file.size,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(filename);
          }
        },
      );
    });
  }

  async findAll(employee_id: number | null = null) {
    const res = await this.conn.query(
      `
                                    SELECT *
                                    FROM files
                                    WHERE deleted_at IS NULL
                                    AND ($1::integer IS NULL OR employee_id = $1)`,
      [employee_id],
    );

    const resWithURL = await Promise.all(
      res.rows.map(async (row) => ({
        ...row,
        URL: await this.getFile(row.file_path),
      })),
    );

    return resWithURL;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
                    SELECT *
                    FROM files
                    WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Файл не найден');
    }

    return {
      ...res.rows[0],
      URL: await this.getFile(res.rows[0].file_path),
    };
  }

  async delete(id: number) {
    const filePath = await this.conn.query(
      `
                    SELECT file_path
                    FROM files
                    WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (filePath.rowCount === 0) {
      throw new NotFoundException('Файл не найден');
    }

    await this.conn.query(
      `
                            UPDATE files
                            SET deleted_at = NOW()
                            WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    await this.minioService.removeObject(
      this.bucketName,
      filePath.rows[0].file_path,
    );

    return;
  }

  async create(file: Express.Multer.File, fileDto: FileDto) {
    if (!file) {
      throw new BadRequestException('Файл не прикреплён');
    }
    await this.validateData(fileDto.employee_id);

    const saveFileName = await this.uploadFile(file);

    const res = await this.conn.query(
      `
                            INSERT INTO files (name, file_path, employee_id)
                            VALUES ($1, $2, $3)
                            RETURNING *`,
      [file.originalname, saveFileName, fileDto.employee_id],
    );

    return res.rows[0];
  }

  async update(id: number, file: Express.Multer.File, fileDto: FileDto) {
    await this.validateData(fileDto.employee_id);

    const oldFilePath = await this.conn.query(
      `
                    SELECT file_path
                    FROM files
                    WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (oldFilePath.rowCount === 0) {
      throw new NotFoundException('Файл не найден');
    }

    const saveFileName = await this.uploadFile(file);

    const res = await this.conn.query(
      `
                            UPDATE files
                            SET name = $1, file_path = $2, employee_id = $3, updated_at = NOW()
                            WHERE id = $4 AND deleted_at IS NULL
                            RETURNING *`,
      [file.originalname, saveFileName, fileDto.employee_id, id],
    );

    await this.minioService.removeObject(
      this.bucketName,
      oldFilePath.rows[0].file_path,
    );

    return res.rows[0];
  }

  async validateData(employee_id: number) {
    const employee = await this.conn.query(
      `
                        SELECT id
                        FROM employees
                        WHERE id = $1`,
      [employee_id],
    );

    if (employee.rows.length === 0) {
      throw new NotFoundException('Сотрудник не найден');
    }
  }
}
