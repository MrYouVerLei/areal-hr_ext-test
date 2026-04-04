import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@Inject(PG_CONNECTION) private conn: any) { }

    async findAll() {
        const res = await this.conn.query(`
                                SELECT *
                                FROM users
                                WHERE deleted_at IS NULL`);

        return res.rows;
    }

    async findOne(id: number) {
        const res = await this.conn.query(`
                SELECT *
                FROM users
                WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );

        if (res.rows.length === 0) {
            throw new NotFoundException('Пользователь не найден');
        }

        return res.rows[0];
    }

    async delete(id: number) {
        const res = await this.conn.query(`
                        UPDATE users
                        SET deleted_at = NOW()
                        WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );

        if (res.rowCount === 0) {
            throw new NotFoundException('Пользователь не найден');
        }

        return;
    }

    async create(userDto: UserDto) {
        await this.validateData(userDto.role_id);

        const res = await this.conn.query(`
                        INSERT INTO users (login, password, last_name, first_name, patronymic, role_id)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING *`,
            [
                userDto.login,
                userDto.password,
                userDto.last_name,
                userDto.first_name,
                userDto.patronymic,
                userDto.role_id
            ]
        );

        return res.rows[0];
    }

    async update(id: number, userDto: UserDto) {
        await this.validateData(userDto.role_id);

        const res = await this.conn.query(`
                        UPDATE users
                        SET login = $1, password = $2, last_name = $3, first_name = $4, patronymic = $5, role_id = $6, updated_at = NOW()
                        WHERE id = $7 AND deleted_at IS NULL
                        RETURNING *`,
            [
                userDto.login,
                userDto.password,
                userDto.last_name,
                userDto.first_name,
                userDto.patronymic,
                userDto.role_id,
                id
            ]
        );

        if (res.rowCount === 0) {
            throw new NotFoundException('Пользователь не найден');
        }

        return res.rows[0];
    }

    async validateData(role_id: number) {
        const role = await this.conn.query(`
                    SELECT id
                    FROM roles
                    WHERE id = $1`,
            [role_id]
        );

        if (role.rows.length === 0) {
            throw new NotFoundException('Роль не найдена');
        }
    }
}
