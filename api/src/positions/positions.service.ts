import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { PositionDto } from './dto/position.dto';

@Injectable()
export class PositionsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

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

  async delete(id: number) {
    const res = await this.conn.query(
      `
            UPDATE positions
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Должность не найдена');
    }

    return;
  }

  async create(positionDto: PositionDto) {
    const res = await this.conn.query(
      `
            INSERT INTO positions (name)
            VALUES ($1)
            RETURNING *`,
      [positionDto.name],
    );

    return res.rows[0];
  }

  async update(id: number, positionDto: PositionDto) {
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

    return res.rows[0];
  }
}
