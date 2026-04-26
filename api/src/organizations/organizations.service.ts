import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { OrganizationDto } from './dto/organization.dto';
import { ChangelogsService } from '../changelogs/changelogs.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    private readonly changelogsService: ChangelogsService,
  ) {}

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

  async delete(id: number, userId: number) {
    const res = await this.conn.query(
      `
            UPDATE organizations
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Организация не найдена');
    }

    await this.changelogsService.create(
      userId,
      'Organization',
      'deleted_at',
      undefined,
      res.rows[0].deleted_at,
    );

    return;
  }

  async create(organizationDto: OrganizationDto, userId: number) {
    const res = await this.conn.query(
      `
            INSERT INTO organizations (name, comment)
            VALUES ($1, $2)
            RETURNING *`,
      [organizationDto.name, organizationDto.comment],
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
        'Organization',
        field,
        undefined,
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }

  async update(id: number, organizationDto: OrganizationDto, userId: number) {
    const oldOrganization = await this.findOne(id);

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

    for (const field in res.rows[0]) {
      if (
        field === 'created_at' ||
        field === 'updated_at' ||
        field === 'deleted_at' ||
        oldOrganization[field] === res.rows[0][field]
      ) {
        continue;
      }

      await this.changelogsService.create(
        userId,
        'Organization',
        field,
        oldOrganization[field],
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }
}
