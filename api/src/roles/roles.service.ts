import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';

@Injectable()
export class RolesService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async findAll() {
    const res = await this.conn.query(`
      SELECT *
      FROM roles`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
                SELECT *
                FROM roles
                WHERE id = $1`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Роль не найдена');
    }

    return res.rows[0];
  }
}
