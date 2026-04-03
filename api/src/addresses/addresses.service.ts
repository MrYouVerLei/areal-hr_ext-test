import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(@Inject(PG_CONNECTION) private conn: any) { }

  async findAll() {
    const res = await this.conn.query(`
                SELECT *
                FROM addresses
                WHERE deleted_at IS NULL`);

    return res.rows;
  }

  async findOne(id: number) {
    const res = await this.conn.query(`
                SELECT *
                FROM addresses
                WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException('Адрес не найден');
    }

    return res.rows[0];
  }

  async delete(id: number) {
    const res = await this.conn.query(`
                UPDATE addresses
                SET deleted_at = NOW()
                WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Адрес не найден');
    }

    return;
  }

  async create(addressDto: AddressDto) {
    const res = await this.conn.query(`
                INSERT INTO addresses (region, locality, street, house, corps, apartment)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
      [
        addressDto.region,
        addressDto.locality,
        addressDto.street,
        addressDto.house,
        addressDto.corps,
        addressDto.apartment
      ]
    );

    return res.rows[0];
  }

  async update(id: number, addressDto: AddressDto) {
    const res = await this.conn.query(`
                UPDATE positiaddressesons
                SET region = $1, locality = $2, street = $3, house = $4, corps = $5, apartment = $6, updated_at = NOW()
                WHERE id = $7 AND deleted_at IS NULL
                RETURNING *`,
      [
        addressDto.region,
        addressDto.locality,
        addressDto.street,
        addressDto.house,
        addressDto.corps,
        addressDto.apartment,
        id
      ]
    );

    if (res.rowCount === 0) {
      throw new NotFoundException('Адрес не найден');
    }

    return res.rows[0];
  }
}
