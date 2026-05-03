import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { HrOperationDto } from './dto/hr-operation.dto';
import { ChangelogsService } from '../changelogs/changelogs.service';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class HrOperationsService {
  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    private readonly changelogsService: ChangelogsService,
    private readonly employeesService: EmployeesService,
  ) {}

  async findAll() {
    const res = await this.conn.query(`
                            SELECT *
                            FROM hr_operations
                            WHERE deleted_at IS NULL`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(
      `
            SELECT *
            FROM hr_operations
            WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Кадровая запись не найдена');
    }

    return res.rows[0];
  }

  async delete(id: number, userId: number) {
    const res = await this.conn.query(
      `
                    UPDATE hr_operations
                    SET deleted_at = NOW()
                    WHERE id = $1 AND deleted_at IS NULL
                    RETURNING *`,
      [id],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Кадровая запись не найдена');
    }

    await this.changelogsService.create(
      userId,
      'HrOperation',
      'deleted_at',
      undefined,
      res.rows[0].deleted_at,
    );

    return;
  }

  async deleteAllRowsWithPosition(
    positionId: number,
    userId: number,
    date: string,
  ) {
    // const res = await this.conn.query(
    //   `
    //                 UPDATE hr_operations
    //                 SET deleted_at = NOW()
    //                 WHERE position_id = $1 AND deleted_at IS NULL
    //                 RETURNING *`,
    //   [positionId],
    // );

    const res = await this.conn.query(
      `
        SELECT DISTINCT
        ON (employee_id) salary, operation_type, operation_date, employee_id, position_id, department_id
        FROM hr_operations
        WHERE position_id = $1 AND deleted_at IS NULL
        ORDER BY employee_id, operation_date DESC `,
      [positionId],
    );

    for (const item of res.rows) {
      const dto: HrOperationDto = {
        salary: Number(item.salary),
        operation_type: 'Увольнение',
        operation_date: date,
        employee_id: Number(item.employee_id),
        position_id: Number(item.position_id),
        department_id: Number(item.department_id),
      };

      await this.create(dto, userId);
      await this.employeesService.delete(Number(item.employee_id), userId);
      // await this.changelogsService.create(
      //   userId,
      //   'HrOperation',
      //   'deleted_at',
      //   undefined,
      //   item.deleted_at,
      // );
    }

    return;
  }

  async deleteAllRowsWithDepartment(
    departmentId: number,
    userId: number,
    date: string,
  ) {
    // const res = await this.conn.query(
    //   `
    //                 UPDATE hr_operations
    //                 SET deleted_at = NOW()
    //                 WHERE department_id = $1 AND deleted_at IS NULL
    //                 RETURNING *`,
    //   [departmentId],
    // );

    const res = await this.conn.query(
      `
        SELECT DISTINCT
        ON (employee_id) salary, operation_type, operation_date, employee_id, position_id, department_id
        FROM hr_operations
        WHERE department_id = $1 AND deleted_at IS NULL
        ORDER BY employee_id, operation_date DESC `,
      [departmentId],
    );

    for (const item of res.rows) {
      const dto: HrOperationDto = {
        salary: Number(item.salary),
        operation_type: 'Увольнение',
        operation_date: date,
        employee_id: Number(item.employee_id),
        position_id: Number(item.position_id),
        department_id: Number(item.department_id),
      };

      await this.create(dto, userId);
      await this.employeesService.delete(Number(item.employee_id), userId);
      // await this.changelogsService.create(
      //   userId,
      //   'HrOperation',
      //   'deleted_at',
      //   undefined,
      //   item.deleted_at,
      // );
    }

    return;
  }

  async create(hrOperationDto: HrOperationDto, userId: number) {
    await this.validateData(
      hrOperationDto.employee_id,
      hrOperationDto.position_id,
      hrOperationDto.department_id,
    );

    const res = await this.conn.query(
      `
                    INSERT INTO hr_operations (salary, operation_type, operation_date, employee_id, position_id, department_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *`,
      [
        hrOperationDto.salary,
        hrOperationDto.operation_type,
        hrOperationDto.operation_date,
        hrOperationDto.employee_id,
        hrOperationDto.position_id,
        hrOperationDto.department_id,
      ],
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
        'HrOperation',
        field,
        undefined,
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }

  async update(id: number, hrOperationDto: HrOperationDto, userId: number) {
    await this.validateData(
      hrOperationDto.employee_id,
      hrOperationDto.position_id,
      hrOperationDto.department_id,
    );

    const oldHrOperation = await this.findOne(id);

    const res = await this.conn.query(
      `
                    UPDATE hr_operations
                    SET salary = $1, operation_type = $2, operation_date = $3, employee_id = $4, position_id = $5, department_id = $6, updated_at = NOW()
                    WHERE id = $7 AND deleted_at IS NULL
                    RETURNING *`,
      [
        hrOperationDto.salary,
        hrOperationDto.operation_type,
        hrOperationDto.operation_date,
        hrOperationDto.employee_id,
        hrOperationDto.position_id,
        hrOperationDto.department_id,
        id,
      ],
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Кадровая запись не найдена');
    }

    for (const field in res.rows[0]) {
      if (
        field === 'created_at' ||
        field === 'updated_at' ||
        field === 'deleted_at' ||
        oldHrOperation[field] === res.rows[0][field]
      ) {
        continue;
      }

      await this.changelogsService.create(
        userId,
        'HrOperation',
        field,
        oldHrOperation[field],
        res.rows[0][field],
      );
    }

    return res.rows[0];
  }

  async validateData(
    employee_id: number,
    position_id: number,
    department_id: number,
  ) {
    const employee = await this.conn.query(
      `
                SELECT id
                FROM employees
                WHERE id = $1 AND deleted_at IS NULL`,
      [employee_id],
    );

    if (employee.rows.length === 0) {
      throw new NotFoundException('Сотрудник не найден');
    }

    const position = await this.conn.query(
      `
                SELECT id
                FROM positions
                WHERE id = $1 AND deleted_at IS NULL`,
      [position_id],
    );

    if (position.rows.length === 0) {
      throw new NotFoundException('Должность не найдена');
    }

    const department = await this.conn.query(
      `
                SELECT id
                FROM departments
                WHERE id = $1 AND deleted_at IS NULL`,
      [department_id],
    );

    if (department.rows.length === 0) {
      throw new NotFoundException('Отдел не найден');
    }
  }
}
