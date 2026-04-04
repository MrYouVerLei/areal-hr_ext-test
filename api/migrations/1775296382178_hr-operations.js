/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('hr_operations', {
        id: 'id',
        salary: {
            type: 'number',
            notNull: true
        },
        operation_type: {
            type: 'varchar(255)',
            notNull: true
        },
        operation_date: {
            type: 'date',
            notNull: true
        },
        employee_id: {
            type: 'integer',
            notNull: true,
            references: '"employees"'
        },
        position_id: {
            type: 'integer',
            notNull: true,
            references: '"positions"'
        },
        department_id: {
            type: 'integer',
            notNull: true,
            references: '"departments"'
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        deleted_at: {
            type: 'timestamp',
            default: null,
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { };
