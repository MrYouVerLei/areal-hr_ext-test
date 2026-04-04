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
    pgm.createTable('passports', {
        id: 'id',
        series: {
            type: 'varchar(4)',
            notNull: true
        },
        number: {
            type: 'varchar(6)',
            notNull: true
        },
        issue_date: {
            type: 'date',
            notNull: true
        },
        subdivision_code: {
            type: 'varchar(7)',
            notNull: true
        },
        issuing_authority: {
            type: 'varchar(255)',
            notNull: true
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
export const down = (pgm) => {
    pgm.dropTable('passports');
};
