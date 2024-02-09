// knexfile.js
require('dotenv').config();

module.exports = {
  client: 'mssql',
  connection: {
    server: 'DESKTOP-SKTGI2Q',
    user: 'mukeshkanna',
    password: 'leo45gkm',
    database: 'kodukku_test_project',
    charset: 'utf8',
   
    options: {
      encrypt: false, 
      
    },
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};


// module.exports = {
//   client: 'mysql',
//   connection: {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'kodukku_test_project',
//     charset: 'utf8',
//   },
  
//   migrations: {
//     tableName: 'knex_migrations',
//     directory: './migrations',
//   },
//   seeds: {
//     directory: './seeds',
//   },
// };