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
    pgm.createTable('addresses', {
        id: 'id',
        region: {
            type: 'varchar(255)',
            notNull: true
        },
        locality: {
            type: 'varchar(255)',
            notNull: true
        },
        street: {
            type: 'varchar(255)'
        },
        house: {
            type: 'varchar(10)',
            notNull: true
        },
        corps: {
            type: 'varchar(10)'
        },
        apartment: {
            type: 'varchar(10)'
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
