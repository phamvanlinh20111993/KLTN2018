
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "KLTN_ExLanguage",
  charset: "utf8_general_ci"
});

//Server: sql12.freemysqlhosting.net
//Name: sql12227778
//Username: sql12227778
//Password: iuwLpRpXNe
//Port number: 3306

con.connect(function(err) {
  if (err) throw err;
});


module.exports = con;

