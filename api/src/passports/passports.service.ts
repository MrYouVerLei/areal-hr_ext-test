import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { PassportDto } from './dto/passport.dto';

@Injectable()
export class PassportsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) { }

  async findAll() {
    const res = await this.conn.query(`
                SELECT *
                FROM passports
                WHERE deleted_at IS NULL`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(`
                SELECT *
                FROM passports
                WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Паспорт не найден');
    }

    return res.rows[0];
  }

  async delete(id: number) {
    const res = await this.conn.query(`
                UPDATE passports
                SET deleted_at = NOW()
                WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Паспорт не найден');
    }

    return;
  }

  async create(passportDto: PassportDto) {
    const res = await this.conn.query(`
                INSERT INTO passports (series, number, issue_date, subdivision_code, issuing_authority)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
      [
        passportDto.series,
        passportDto.number,
        passportDto.issue_date,
        passportDto.subdivision_code,
        passportDto.issuing_authority
      ]
    );

    return res.rows[0];
  }

  async update(id: number, passportDto: PassportDto) {
    const res = await this.conn.query(`
                UPDATE passports
                SET series = $1, number = $2, issue_date = $3, subdivision_code = $4, issuing_authority = $5, updated_at = NOW()
                WHERE id = $6 AND deleted_at IS NULL
                RETURNING *`,
      [
        passportDto.series,
        passportDto.number,
        passportDto.issue_date,
        passportDto.subdivision_code,
        passportDto.issuing_authority,
        id
      ]
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Паспорт не найден');
    }

    return res.rows[0];
  }
}
