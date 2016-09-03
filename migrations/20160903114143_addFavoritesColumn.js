
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('places', function(table) {
    table.boolean('is_favorite');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropColumn('is_favorite');
};
