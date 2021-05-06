const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "mysqlpassword",
  database: "employee_DB"
});

connection.connect(error => {
  error ? console.log(error) : console.log("Connected!");
});

module.exports = connection;