import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';

@Injectable()
export class OrganizationsService {
    constructor(@Inject(PG_CONNECTION) private conn: any) {}

    async findAll() {
        const res = await this.conn.query('SELECT * FROM organizations');
        return res.rows;
    }
}
