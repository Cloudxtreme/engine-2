
exports.up = function(knex, Promise) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        .createTable("players", (table) => {
            table.increments("id").primary();
            table.uuid("uuid").unique().notNull().default(knex.raw("uuid_generate_v1()")).index();
            table.string("username").notNull().unique().index();
            table.string("email").unique();
            table.string("first_name");
            table.string("last_name");
            table.string("hashed_password")
        })

};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable("players")
};
