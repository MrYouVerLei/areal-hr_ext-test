import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PermissionDto } from './dto/permission.dto';
import { PG_CONNECTION } from '../constants';

@Injectable()
export class PermissionsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async findAll() {
    const res = await this.conn.query(`
      SELECT *
      FROM permissions
      WHERE deleted_at IS NULL`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
                SELECT *
                FROM permissions
                WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Разрешение не найдено');
    }

    return res.rows[0];
  }

  async delete(id: number) {
    const res = await this.conn.query(
      `
                        UPDATE permissions
                        SET deleted_at = NOW()
                        WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Разрешение не найдено');
    }

    return;
  }

  async create(permissionDto: PermissionDto) {
    await this.validateData(permissionDto.role_id);

    const res = await this.conn.query(
      `
                        INSERT INTO permissions (action, subject, role_id)
                        VALUES ($1, $2, $3)
                        RETURNING *`,
      [permissionDto.action, permissionDto.subject, permissionDto.role_id],
    );

    return res.rows[0];
  }

  async update(id: number, permissionDto: PermissionDto) {
    await this.validateData(permissionDto.role_id);

    const res = await this.conn.query(
      `
                        UPDATE permissions
                        SET action = $1, subject = $2, role_id = $3, updated_at = NOW()
                        WHERE id = $4 AND deleted_at IS NULL
                        RETURNING *`,
      [permissionDto.action, permissionDto.subject, permissionDto.role_id, id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Разрешение не найдено');
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
