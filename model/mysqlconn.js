
var mysql = require('mysql');

/*var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "KLTN_ExLanguage",
  charset: "utf8_general_ci"
}); */

var con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12234645",
  password: "9wWUf9NFSM",
  database: "sql12234645",
  charset: "utf8_general_ci"
}); 

con.connect(function(err) {
  if (err) throw err;
});


module.exports = con;

