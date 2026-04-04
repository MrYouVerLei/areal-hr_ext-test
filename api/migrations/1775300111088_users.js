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
    pgm.createTable('users', {
        id: 'id',
        login: {
            type: 'varchar(50)',
            notNull: true,
            unique: true
        },
        password: {
            type: 'varchar(255)',
            notNull: true
        },
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
        role_id: {
            type: 'integer',
            notNull: true,
            references: '"roles"'
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
    pgm.dropTable('users');
};
