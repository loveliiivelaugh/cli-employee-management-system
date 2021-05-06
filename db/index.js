const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "localhost",
  user: "your-db-user",
  port: 3306,
  password: "your-db-password",
  database: "employee_DB"
});

connection.connect(error => {
  error ? console.log(error) : console.log("Connected!");
});

module.exports = connection;
