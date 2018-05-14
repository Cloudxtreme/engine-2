
exports.up = function(knex, Promise) {
    return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        .raw('CREATE FUNCTION set_updated_timestamp()\n' +
            '  RETURNS TRIGGER\n' +
            '  LANGUAGE plpgsql\n' +
            'AS $$\n' +
            ' BEGIN\n' +
            '  NEW.updated_timestamp := now();\n' +
            'END;\n' +
            ' $$;')
        .createTable('players', (table) => {
            table.increments('id').primary();
            table.uuid('uuid').unique().notNull().default(knex.raw('uuid_generate_v1()')).index();
            table.string('username').notNull().unique().index();
            table.string('password');
            table.dateTime('created_at').notNull().default(knex.raw('now()'));
            table.dateTime('updated_at').notNull().default(knex.raw('now()'));
        })
        .raw('CREATE TRIGGER update_players_timestamp' +
            ' BEFORE UPDATE ON players\n' +
            'FOR EACH ROW EXECUTE PROCEDURE set_updated_timestamp();')
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('players')
        .raw('DROP FUNCTION set_updated_timestamp()')
};
