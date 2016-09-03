
exports.up = function(knex, Promise) {
  return knex.schema.createTable('places', function(table) {
    table.increments('id').primary();
    table.integer('user_id');
    table.string('name');
    table.string('image');
    table.string('address_line_1');
    table.string('address_line_2');
    table.string('address_line_3');
    table.string('city');
    table.string('state');
    table.string('zip');
    table.string('yelp_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('places');
};
