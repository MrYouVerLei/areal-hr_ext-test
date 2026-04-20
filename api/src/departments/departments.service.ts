import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { DepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async findAll() {
    const res = await this.conn.query(`
                    SELECT *
                    FROM departments
                    WHERE deleted_at IS NULL
                    ORDER BY name`);

    return res.rows;
  }

  async findAllInOrganization(organizationId: number) {
    await this.validateData(organizationId);

    const res = await this.conn.query(
      `
        WITH RECURSIVE dep AS (SELECT id, name, comment, parent_id
                               FROM departments
                               WHERE parent_id IS NULL
                                 AND organization_id = $1
                               UNION ALL
                               SELECT c.id, c.name, c.comment, c.parent_id
                               FROM dep p,
                                    departments c
                               WHERE c.parent_id = p.id)
        SELECT *
        FROM dep;`,
      [organizationId],
    );

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
            SELECT *
            FROM departments
            WHERE id = $1
              AND deleted_at IS NULL`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Отдел не найден');
    }

    return res.rows[0];
  }

  async delete(id: number) {
    const res = await this.conn.query(
      `
            UPDATE departments
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Отдел не найден');
    }

    return;
  }

  async create(departmentDto: DepartmentDto) {
    await this.validateData(
      departmentDto.organization_id,
      departmentDto.parent_id,
    );

    const res = await this.conn.query(
      `
            INSERT INTO departments (name, comment, organization_id, parent_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [
        departmentDto.name,
        departmentDto.comment,
        departmentDto.organization_id,
        departmentDto.parent_id,
      ],
    );

    return res.rows[0];
  }

  async update(id: number, departmentDto: DepartmentDto) {
    await this.validateData(
      departmentDto.organization_id,
      departmentDto.parent_id,
    );

    if (id === departmentDto.parent_id) {
      throw new BadRequestException(
        'Отдел не может быть родителем самому себе',
      );
    }

    const res = await this.conn.query(
      `
            UPDATE departments
            SET name = $1, comment = $2, organization_id = $3, parent_id = $4, updated_at = NOW()
            WHERE id = $5 AND deleted_at IS NULL
            RETURNING *`,
      [
        departmentDto.name,
        departmentDto.comment,
        departmentDto.organization_id,
        departmentDto.parent_id,
        id,
      ],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Отдел не найден');
    }

    return res.rows[0];
  }

  async validateData(organizationId: number, parentId?: number) {
    const organization = await this.conn.query(
      `
            SELECT id
            FROM organizations
            WHERE id = $1 AND deleted_at IS NULL`,
      [organizationId],
    );

    if (organization.rows.length === 0) {
      throw new NotFoundException('Организация не найдена');
    }

    if (parentId) {
      const parentDepartment = await this.conn.query(
        `
                SELECT id, organization_id
                FROM departments
                WHERE id = $1 AND deleted_at IS NULL`,
        [parentId],
      );

      if (parentDepartment.rows.length === 0) {
        throw new NotFoundException('Родительский отдел не найден');
      }

      if (parentDepartment.rows[0].organization_id != organizationId) {
        throw new BadRequestException(
          'Родительский отдел и создаваемый/изменяемый отдел принадлежат разным организациям',
        );
      }
    }
  }
}
