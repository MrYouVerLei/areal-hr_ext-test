import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';

@Injectable()
export class ChangelogsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async findAll() {
    const res = await this.conn.query(`
                                    SELECT *
                                    FROM changelogs`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
                    SELECT *
                    FROM changelogs
                    WHERE id = $1`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Запись в логе не найдена');
    }

    return res.rows[0];
  }

  async create(
    user_id: number,
    object_type: string,
    field_name: string,
    old_value?: string,
    new_value?: string,
  ) {
    await this.validateData(user_id);

    const res = await this.conn.query(
      `
                            INSERT INTO changelogs (object_type, field_name, old_value, new_value, user_id)
                            VALUES ($1, $2, $3, $4, $5)
                            RETURNING *`,
      [object_type, field_name, old_value, new_value, user_id],
    );

    return res.rows[0];
  }

  async validateData(user_id: number) {
    const user = await this.conn.query(
      `
                        SELECT id
                        FROM users
                        WHERE id = $1`,
      [user_id],
    );

    if (user.rows.length === 0) {
      throw new NotFoundException('Пользователь не найден');
    }
  }
}
