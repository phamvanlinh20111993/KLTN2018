var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "KLTN_ExLanguage",
  charset: "utf8_general_ci"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected Successful!");
});


var editMessage = function(idmsg, whoeditid, content, cb){

	var sql = "SELECT message_id, whoedit FROM editmessage LIMIT 1"
	var sqlString = ""

	con.query(sql, function(err, result, fields){
		if (err) throw err;
		else{
			if(result.length > 0){

				sqlString = "UPDATE editmessage SET newcontent = "+ mysql.escape(content) +
					", time = "+ new Date() +
					" WHERE message_id = "+mysql.escape(idmsg) +
					" AND whoedit = " + mysql.escape(whoeditid)

				con.query(sqlString, function(err1, result1, fields1){
					if(err) cb(null, err1)
					else cb(result1.affectedRows, null)
				})

			}else{//chua co du lieu
				sqlString = "INSERT INTO editmessage (message_id, whoedit, content, time) "+
					"VALUES(" + mysql.escape(idmsg) + "," + mysql.escape(whoeditid) +
					", " + mysql.escape(content)+", "+new Date()+")"

				con.query(sqlString, function(err1, result1, fields1){
					if(err) cb(null, err1)
					else cb(result1.affectedRows, null)
				})
			}
		}
	})
}


module.exports = {
	editMessage: editMessage
}
