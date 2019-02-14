
var mysql = require('mysql');

//server local
var con = mysql.createConnection({
  host: "sql303.byethost.com",
  user: "b31_22948334",
  password: "cuong123",
  database: "b31_22948334_KLTN_ExLanguage",
  charset: "utf8_general_ci"
}); 


//server online
/*
  Server: sql9.freemysqlhosting.net
  Name: sql9237381
  Username: sql9237381
  Password: f8vbBJ4EyU
  Port number: 3306
*/

//account: phamvanthan957@gmail.com
//pass: G!$!7RYPwwFg7OHL
//page: https://www.freemysqlhosting.net/account/
//      https://www.freemysqlhosting.net/
//      http://www.phpmyadmin.co/
// var con = mysql.createConnection({
//   host: "sql9.freemysqlhosting.net",
//   user: "sql9237381",
//   password: "f8vbBJ4EyU",
//   database: "sql9237381",
//   charset: "utf8_general_ci"
// });

con.connect(function(err) {
  if (err) throw err;
  else 
    console.log("Mysql Connected Successful in Model!");
});
//var connection = mysql.createConnection('mysql://user:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');


module.exports = con;

