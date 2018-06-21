const mysql = require('mysql');

const mysqlConnection = () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'soccer'
  });

  connection.connect();

  return connection;
}

module.exports.mysql = mysqlConnection;
