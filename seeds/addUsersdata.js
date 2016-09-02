var bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([

        // Inserts seed entries
        knex('users').insert({
          id: 1,
          username: 'lizzie',
          password: bcrypt.hashSync('password', 8),
          first_name: 'Lizzie',
          last_name: 'Szoke',
          is_admin: true
          }),
        knex('users').insert({
          id: 2,
          username: 'ivy',
          password: bcrypt.hashSync('password', 8),
          first_name: 'Ivy',
          last_name: 'Szoke',
          is_admin: false
        })

      ]);
    });
};
