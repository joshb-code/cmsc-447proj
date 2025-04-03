const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "cmsc447",
  database: "inventory",
});

module.exports = pool.promise(); // for using async/await
