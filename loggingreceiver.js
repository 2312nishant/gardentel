var mysql = require('mysql');

var con2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database : "iot",
  port: "3306",
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
});

con2.connect(function(err) {
  if (err) throw err; 
  console.log("Connected!");
});

module.exports = con2;