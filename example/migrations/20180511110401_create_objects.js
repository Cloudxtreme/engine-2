
exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('objects', (table) => {
          table.increments('id').primary();
          table.uuid('uuid').unique().notNull();
          table.string('object_type').notNull().index();
          table.jsonb('data').notNull();
          table.integer('player_id').unsigned().references('players').index();
          table.dateTime('created_at').unsigned().notNull().index().default(knex.raw('now()'));
          table.dateTime('updated_at').notNull();
      })
      .raw('CREATE TRIGGER update_objects_timestamp' +
          ' BEFORE UPDATE ON players\n' +
          'FOR EACH ROW EXECUTE PROCEDURE set_updated_timestamp();')
};

exports.down = function(knex, Promise) {

};
