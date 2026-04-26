import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { PassportDto } from './dto/passport.dto';
import { ChangelogsService } from '../changelogs/changelogs.service';

@Injectable()
export class PassportsService {
  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    private readonly changelogsService: ChangelogsService,
  ) {}

  async findAll() {
    const res = await this.conn.query(`
                SELECT *
                FROM passports
                WHERE deleted_at IS NULL`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
                SELECT *
                FROM passports
                WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Паспорт не найден');
    }

    return res.rows[0];
  }

  async delete(id: number, userId: number) {
    const res = await this.conn.query(
      `
                UPDATE passports
                SET deleted_at = NOW()
                WHERE id = $1 AND deleted_at IS NULL
                RETURNING *`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Паспорт не найден');
    }

    await this.changelogsService.create(
      userId,
      'Passport',
      'deleted_at',
      undefined,
      res.rows[0].deleted_at,
    );

    return;
  }

  async create(passportDto: PassportDto, userId: number) {
    const res = await this.conn.query(
      `
                INSERT INTO passports (series, number, issue_date, subdivision_code, issuing_authority)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
      [
        passportDto.series,
        passportDto.number,
        passportDto.issue_date,
        passportDto.subdivision_code,
        passportDto.issuing_authority,
      ],
    );

    for (const field in res.rows[0]) {
      if (
        field === 'created_at' ||
        field === 'updated_at' ||
        field === 'deleted_at'
      ) {
        continue;
      }

      await this.changelogsService.create(
        userId,
        'Passport',
        field,
        undefined,
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }

  async update(id: number, passportDto: PassportDto, userId: number) {
    const oldPassport = await this.findOne(id);

    const res = await this.conn.query(
      `
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
        id,
      ],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Паспорт не найден');
    }

    for (const field in res.rows[0]) {
      if (
        field === 'created_at' ||
        field === 'updated_at' ||
        field === 'deleted_at' ||
        oldPassport[field] === res.rows[0][field]
      ) {
        continue;
      }

      await this.changelogsService.create(
        userId,
        'Passport',
        field,
        oldPassport[field],
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }
}
