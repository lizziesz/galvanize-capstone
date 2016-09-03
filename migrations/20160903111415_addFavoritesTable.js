
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(table) {
    table.increments('id').primary();
    table.integer('place_id');
    table.integer('user_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
