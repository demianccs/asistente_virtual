const mysql = require('mysql2');
const pool = mysql.createConnection({
    host: 'HOST', 
    user:'USER', 
    password: 'PASS',
    database: 'BD_NOMBRE',
    charset: 'utf8mb4',
    // operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  });

module.exports = pool;
