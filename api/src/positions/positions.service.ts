import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { PositionDto } from './dto/position.dto';
import { ChangelogsService } from '../changelogs/changelogs.service';
import { HrOperationsService } from '../hr-operations/hr-operations.service';

@Injectable()
export class PositionsService {
  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    private readonly changelogsService: ChangelogsService,
    private readonly hrOperationService: HrOperationsService,
  ) {}

  async findAll() {
    const res = await this.conn.query(`
            SELECT *
            FROM positions
            WHERE deleted_at IS NULL
            order by name`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
            SELECT *
            FROM positions
            WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Должность не найдена');
    }

    return res.rows[0];
  }

  async delete(id: number, userId: number, date?: string) {
    const res = await this.conn.query(
      `
            UPDATE positions
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Должность не найдена');
    }

    await this.hrOperationService.deleteAllRowsWithPosition(
      Number(res.rows[0].id),
      userId,
      date || Date.now().toLocaleString(),
    );

    await this.changelogsService.create(
      userId,
      'Position',
      'deleted_at',
      undefined,
      res.rows[0].deleted_at,
    );

    return;
  }

  async create(positionDto: PositionDto, userId: number) {
    const res = await this.conn.query(
      `
            INSERT INTO positions (name)
            VALUES ($1)
            RETURNING *`,
      [positionDto.name],
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
        'Position',
        field,
        undefined,
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }

  async update(id: number, positionDto: PositionDto, userId: number) {
    const oldPosition = await this.findOne(id);

    const res = await this.conn.query(
      `
            UPDATE positions
            SET name = $1, updated_at = NOW()
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING *`,
      [positionDto.name, id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Должность не найдена');
    }

    for (const field in res.rows[0]) {
      if (
        field === 'created_at' ||
        field === 'updated_at' ||
        field === 'deleted_at' ||
        oldPosition[field] === res.rows[0][field]
      ) {
        continue;
      }

      await this.changelogsService.create(
        userId,
        'Position',
        field,
        oldPosition[field],
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }
}
