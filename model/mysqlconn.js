
var mysql = require('mysql');

//server local
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "KLTN_ExLanguage",
  charset: "utf8_general_ci"
});


//server online
/*
  Server: sql12.freemysqlhosting.net
  Name: sql12234645
  Username: sql12234645
  Password: 9wWUf9NFSM
  Port number: 3306
*/

//account: thaithelong1995@gmail.com
//pass: L12345678aaaaaaaaaaa
//page: https://www.freemysqlhosting.net/account/
//      https://www.freemysqlhosting.net/
/*var con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12234645",
  password: "9wWUf9NFSM",
  database: "sql12234645",
  charset: "utf8_general_ci"
}); */

con.connect(function(err) {
  if (err) throw err;
  else 
    console.log("Mysql Connected Successful in Model!");
});
//var connection = mysql.createConnection('mysql://user:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');


module.exports = con;

