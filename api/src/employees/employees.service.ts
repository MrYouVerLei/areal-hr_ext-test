import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { EmployeeDto } from './dto/employee.dto';
import { AddressesService } from '../addresses/addresses.service';
import { PassportsService } from '../passports/passports.service';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject(PG_CONNECTION) private conn: any,
    private readonly addressesService: AddressesService,
    private readonly passportsService: PassportsService
  ) { }

  async findAll(name: string = "") {
    const res = await this.conn.query(`
                        SELECT *
                        FROM employees e
                        WHERE (e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.patronymic, '')) ILIKE $1`,
      ["%" + name + "%"]);

    return res.rows;
  }

  async findAllDetail(name: string = "", department_id: number | null = null, position_id: number | null = null) {
    const res = await this.conn.query(`
                        SELECT e.*, d.name AS department_name, p.name AS position_name
                        FROM employees e
                        LEFT JOIN LATERAL (SELECT *
                                  FROM hr_operations hr
                                  WHERE hr.employee_id = e.id
                                  ORDER BY hr.operation_date DESC
                                  LIMIT 1) hr_last
                        ON e.id = hr_last.employee_id
                        LEFT JOIN departments d
                        ON hr_last.department_id = d.id
                        LEFT JOIN positions p
                        ON hr_last.position_id = p.id
                        WHERE (e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.patronymic, '')) ILIKE $1
                        AND ($2::integer IS NULL OR d.id = $2)
                        AND ($3::integer IS NULL OR p.id = $3)`,
      ["%" + name + "%", department_id, position_id]);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(`
        SELECT *
        FROM employees
        WHERE id = $1`,
      [id]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Сотрудник не найден');
    }

    return res.rows[0];
  }
  
  async findOneDetail(id: number) {
    const res = await this.conn.query(`
        SELECT e.*, p.series, p.number, p.issue_date, p.subdivision_code, p.issuing_authority, a.region, a.locality, a.street, a.house, a.corps, a.apartment
        FROM employees e
        LEFT JOIN addresses a
        ON a.id = e.address_id
        LEFT JOIN passports p
        ON p.id = e.passport_id
        WHERE e.id = $1`,
      [id]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Сотрудник не найден');
    }

    return res.rows[0];
  }

  async delete(id: number) {
    const res = await this.conn.query(`
                UPDATE employees
                SET deleted_at = NOW()
                WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Сотрудник не найден');
    }

    return;
  }

  async create(employeeDto: EmployeeDto) {
    const address = await this.addressesService.create(employeeDto.address);
    const passport = await this.passportsService.create(employeeDto.passport);

    const res = await this.conn.query(`
                INSERT INTO employees (last_name, first_name, patronymic, birth_date, address_id, passport_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
      [
        employeeDto.last_name,
        employeeDto.first_name,
        employeeDto.patronymic,
        employeeDto.birth_date,
        address.id,
        passport.id
      ]
    );

    return res.rows[0];
  }

  async update(id: number, employeeDto: EmployeeDto) {
    const data = await this.conn.query(`
            SELECT address_id, passport_id
            FROM employees
            WHERE id = $1`,
      [id]
    );

    if (data.rowCount === 0) {
      throw new NotFoundException('Сотрудник не найден');
    }

    const address = await this.addressesService.update(data.rows[0].address_id, employeeDto.address);
    const passport = await this.passportsService.update(data.rows[0].passport_id, employeeDto.passport);

    const res = await this.conn.query(`
                UPDATE employees
                SET last_name = $1, first_name = $2, patronymic = $3, birth_date = $4, address_id = $5, passport_id = $6, updated_at = NOW()
                WHERE id = $7
                RETURNING *`,
      [
        employeeDto.last_name,
        employeeDto.first_name,
        employeeDto.patronymic,
        employeeDto.birth_date,
        address.id,
        passport.id,
        id
      ]
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Сотрудник не найден');
    }

    return res.rows[0];
  }
}
