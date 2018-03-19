var mysql = require('mysql');

var con = mysql.createConnection({
  connectionLimit : 20,
  host: "localhost",
  user: "root",
  password: "",
  database: "KLTN_ExLanguage",
  charset: "utf8_general_ci"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected Postcomment Successful!");
});


var selectMyposts_cmts = function(myid, cb){
	var sqlString = ""
}


var selectNotMyposts_cmts = function(myid, cb){

}


var selectposts_cmts_myfollow = function(myid, cb){

}


module.exports = {
	selectposts_cmts_myfollow: selectposts_cmts_myfollow,
	selectMyposts_cmts: selectMyposts_cmts,
	selectNotMyposts_cmts: selectNotMyposts_cmts
}