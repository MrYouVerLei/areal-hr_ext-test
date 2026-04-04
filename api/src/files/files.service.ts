import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { FileDto } from './dto/file.dto';

@Injectable()
export class FilesService {
    constructor(@Inject(PG_CONNECTION) private conn: any) { }

    async findAll() {
        const res = await this.conn.query(`
                                    SELECT *
                                    FROM files
                                    WHERE deleted_at IS NULL`);

        return res.rows;
    }

    async findOne(id: number) {
        const res = await this.conn.query(`
                    SELECT *
                    FROM files
                    WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );

        if (res.rows.length === 0) {
            throw new NotFoundException('Файл не найден');
        }

        return res.rows[0];
    }

    async delete(id: number) {
        const res = await this.conn.query(`
                            UPDATE files
                            SET deleted_at = NOW()
                            WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );

        if (res.rowCount === 0) {
            throw new NotFoundException('Файл не найден');
        }

        return;
    }

    async create(fileDto: FileDto) {
        await this.validateData(fileDto.employee_id);

        const res = await this.conn.query(`
                            INSERT INTO files (name, file_path, employee_id)
                            VALUES ($1, $2, $3)
                            RETURNING *`,
            [
                fileDto.name,
                fileDto.file_path,
                fileDto.employee_id
            ]
        );

        return res.rows[0];
    }

    async update(id: number, fileDto: FileDto) {
        await this.validateData(fileDto.employee_id);

        const res = await this.conn.query(`
                            UPDATE files
                            SET name = $1, file_path = $2, employee_id = $3, updated_at = NOW()
                            WHERE id = $4 AND deleted_at IS NULL
                            RETURNING *`,
            [
                fileDto.name,
                fileDto.file_path,
                fileDto.employee_id,
                id
            ]
        );

        if (res.rowCount === 0) {
            throw new NotFoundException('Файл не найден');
        }

        return res.rows[0];
    }

    async validateData(employee_id: number) {
        const employee = await this.conn.query(`
                        SELECT id
                        FROM employees
                        WHERE id = $1`,
            [employee_id]
        );

        if (employee.rows.length === 0) {
            throw new NotFoundException('Сотрудник не найден');
        }
    }
}
