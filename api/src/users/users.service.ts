import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async findAll() {
    const res = await this.conn.query(`
                                SELECT users.*, roles.name AS role_name
                                FROM users
                                LEFT JOIN roles
                                ON users.role_id = roles.id
                                WHERE users.deleted_at IS NULL`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
                SELECT users.*, roles.name AS role_name, JSON_AGG(
                  JSON_BUILD_OBJECT('action', permissions.action, 'subject', permissions.subject)
                                                         ) AS permissions
                FROM users
                LEFT JOIN roles
                ON users.role_id = roles.id
                LEFT JOIN permissions
                ON roles.id = permissions.role_id
                WHERE users.id = $1 AND users.deleted_at IS NULL
                GROUP BY users.id, roles.name`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Пользователь не найден');
    }

    return res.rows[0];
  }

  async findOneByLogin(login: string) {
    const res = await this.conn.query(
      `
                SELECT users.*, roles.name AS role_name
                FROM users
                LEFT JOIN roles
                ON users.role_id = roles.id
                WHERE users.login = $1 AND deleted_at IS NULL`,
      [login],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Пользователь не найден');
    }

    return res.rows[0];
  }

  async checkUniqueLogin(login: string): Promise<boolean> {
    const res = await this.conn.query(
      `
                SELECT login
                FROM users
                WHERE login = $1
                LIMIT 1`,
      [login],
    );

    return res.rows.length === 0;
  }

  async delete(id: number) {
    const res = await this.conn.query(
      `
                        UPDATE users
                        SET deleted_at = NOW()
                        WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Пользователь не найден');
    }

    return;
  }

  async create(userDto: CreateUserDto) {
    await this.validateData(userDto.role_id);

    const hash = await argon2.hash(userDto.password);

    const res = await this.conn.query(
      `
                        INSERT INTO users (login, password, last_name, first_name, patronymic, role_id)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING *`,
      [
        userDto.login,
        hash,
        userDto.last_name,
        userDto.first_name,
        userDto.patronymic,
        userDto.role_id,
      ],
    );

    return res.rows[0];
  }

  async updateAll(id: number, userDto: CreateUserDto) {
    await this.validateData(userDto.role_id);

    const hash = await argon2.hash(userDto.password);

    const res = await this.conn.query(
      `
                        UPDATE users
                        SET login = $1, password = $2, last_name = $3, first_name = $4, patronymic = $5, role_id = $6, updated_at = NOW()
                        WHERE id = $7 AND deleted_at IS NULL
                        RETURNING *`,
      [
        userDto.login,
        hash,
        userDto.last_name,
        userDto.first_name,
        userDto.patronymic,
        userDto.role_id,
        id,
      ],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Пользователь не найден');
    }

    return res.rows[0];
  }

  async update(id: number, userDto: UpdateUserDto) {
    if (userDto.role_id) {
      await this.validateData(userDto.role_id);
    }

    const res = await this.conn.query(
      `
        UPDATE users
        SET password   = COALESCE($1, password),
            last_name  = COALESCE($2, last_name),
            first_name = COALESCE($3, first_name),
            patronymic = COALESCE($4, patronymic),
            role_id    = COALESCE($5, role_id),
            updated_at = NOW()
        WHERE id = $6
          AND deleted_at IS NULL RETURNING *`,
      [
        userDto.password ? await argon2.hash(userDto.password) : null,
        userDto.last_name || null,
        userDto.first_name || null,
        userDto.patronymic ?? null,
        userDto.role_id || null,
        id,
      ],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Пользователь не найден');
    }

    return res.rows[0];
  }

  async validateData(role_id: number) {
    const role = await this.conn.query(
      `
                    SELECT id
                    FROM roles
                    WHERE id = $1`,
      [role_id],
    );

    if (role.rows.length === 0) {
      throw new NotFoundException('Роль не найдена');
    }
  }
}
