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
    pgm.createTable('employees', {
        id: 'id',
        last_name: {
            type: 'varchar(50)',
            notNull: true
        },
        first_name: {
            type: 'varchar(50)',
            notNull: true
        },
        patronymic: {
            type: 'varchar(50)'
        },
        birth_date: {
            type: 'date',
            notNull: true
        },
        address_id: {
            type: 'integer',
            notNull: true,
            references: '"addresses"'
        },
        passport_id: {
            type: 'integer',
            notNull: true,
            references: '"passports"'
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
export const down = (pgm) => {};
