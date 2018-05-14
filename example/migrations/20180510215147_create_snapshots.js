
exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('snapshots', (table) => {
          table.increments('id').primary();
          table.dateTime('created_at').unsigned().notNull().index().default(knex.raw('now()'));
          table.jsonb('data').notNull()
      })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('snapshots')
};
