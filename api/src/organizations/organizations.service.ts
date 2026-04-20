import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { OrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async findAll() {
    const res = await this.conn.query(`
          SELECT *
          FROM organizations
          WHERE deleted_at IS NULL
          ORDER BY name`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
            SELECT *
            FROM organizations
            WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Организация не найдена');
    }

    return res.rows[0];
  }

  async delete(id: number) {
    const res = await this.conn.query(
      `
            UPDATE organizations
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Организация не найдена');
    }

    return;
  }

  async create(organizationDto: OrganizationDto) {
    const res = await this.conn.query(
      `
            INSERT INTO organizations (name, comment)
            VALUES ($1, $2)
            RETURNING *`,
      [organizationDto.name, organizationDto.comment],
    );

    return res.rows[0];
  }

  async update(id: number, organizationDto: OrganizationDto) {
    const res = await this.conn.query(
      `
            UPDATE organizations
            SET name = $1, comment = $2, updated_at = NOW()
            WHERE id = $3 AND deleted_at IS NULL
            RETURNING *`,
      [organizationDto.name, organizationDto.comment, id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Организация не найдена');
    }

    return res.rows[0];
  }
}
