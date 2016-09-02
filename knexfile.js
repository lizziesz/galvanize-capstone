// Update with your config settings.
module.exports = {

  development: {
    client: 'postgres',
    connection: 'postgres://localhost:5432/foodme'
  },
  production: {
    client: 'postgres',
    connection: process.env.DATABASE_URL
  }

};
