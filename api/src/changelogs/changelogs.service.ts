import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';

@Injectable()
export class ChangelogsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async findAll(
    page: number,
    rowsPerPage: number,
    from: string | null = null,
    to: string | null = null,
    object: string | null = null,
    field: string | null = null,
  ) {
    const res = await this.conn.query(
      `
        SELECT changelogs.*, users.last_name, users.first_name, users.patronymic, users.login
        FROM changelogs
        LEFT JOIN users
          ON users.id = changelogs.user_id
        WHERE (changelogs.date_time >= $1 OR $1 IS NULL)
          AND (changelogs.date_time <= $2 OR $2 IS NULL)
          AND (changelogs.object_type = $3 OR $3 IS NULL)
          AND (changelogs.field_name = $4 OR $4 IS NULL)
        ORDER BY changelogs.date_time DESC
        LIMIT $5 OFFSET $6`,
      [from, to, object, field, rowsPerPage, (page - 1) * rowsPerPage],
    );

    const countRows = await this.conn.query(
      `
        SELECT COUNT(*) AS count
        FROM changelogs
        LEFT JOIN users
          ON users.id = changelogs.user_id
        WHERE (changelogs.date_time >= $1 OR $1 IS NULL)
          AND (changelogs.date_time <= $2 OR $2 IS NULL)
          AND (changelogs.object_type = $3 OR $3 IS NULL)
          AND (changelogs.field_name = $4 OR $4 IS NULL)`,
      [from, to, object, field],
    );

    return {
      data: res.rows,
      count: countRows.rows[0].count,
    };
  }

  async findAllTypeObjects() {
    const res = await this.conn.query(
      `
        SELECT object_type
        FROM changelogs
        GROUP BY object_type
        ORDER BY object_type`,
    );

    return res.rows;
  }

  async findAllFields() {
    const res = await this.conn.query(
      `
        SELECT field_name
        FROM changelogs
        GROUP BY field_name
        ORDER BY field_name`,
    );

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
