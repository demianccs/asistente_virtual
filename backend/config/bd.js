const mysql = require('mysql2');
const pool = mysql.createConnection({
    host: '89.117.59.147', 
    user:'datacombo', 
    password: 'D4t4comiano$2023!',
    database: 'Asistente',
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