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

  async findAll() {
    const res = await this.conn.query(`
                        SELECT *
                        FROM employees
                        WHERE deleted_at IS NULL`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(`
        SELECT *
        FROM employees
        WHERE id = $1 AND deleted_at IS NULL`,
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
            WHERE id = $1 AND deleted_at IS NULL`,
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
                WHERE id = $7 AND deleted_at IS NULL
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
