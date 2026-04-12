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
    pgm.createTable('changelogs', {
        id: 'id',
        date_time: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        object_type: {
            type: 'varchar(255)',
            notNull: true
        },
        field_name: {
            type: 'varchar(255)',
            notNull: true
        },
        old_value: {
            type: 'text'
        },
        new_value: {
            type: 'text'
        },
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"users"'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('changelogs');
};
