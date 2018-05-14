
exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('objects', (table) => {
          table.increments('id').primary();
          table.uuid('uuid').unique().notNull().default((knex.raw('uuid_generate_v1()'))).index();
          table.string('object_type').notNull().index();
          table.string('key').notNull().unique().index();
          table.jsonb('data').notNull();
          table.integer('player_id').unsigned().index().references('players');
          table.dateTime('created_at').unsigned().notNull().index().default(knex.raw('now()'));
          table.dateTime('updated_at').notNull().default(knex.raw('now()'));
      })
      .raw('CREATE TRIGGER update_objects_timestamp' +
          ' BEFORE UPDATE ON players\n' +
          'FOR EACH ROW EXECUTE PROCEDURE set_updated_timestamp();')
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('objects')
};
