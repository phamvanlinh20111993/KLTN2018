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

//limit comment load to user
var selectMyposts = function(myid, cb){
	var sqlString = "SELECT p.id AS pid, p.user_id AS uid, p.content, p.ctime as ptime, " +
                  " p.turnof_cmt, ti.id AS tid, ti.name AS tiname, u.email, u.name AS uname, " +
                  " u.photo, u.score, le.level FROM post p" +
                  " JOIN User u ON p.user_id = u.id " +
                  " JOIN title ti ON ti.id = p.title_id " + 
                  " JOIN level le ON le.id = u.level_id " +
                  " WHERE p.user_id = "+ mysql.escape(myid)

  con.query(sqlString, function(err, result){
    if(err)
      cb(null, err)
    else{
      console.log(result)
      cb(result, null)
    }
  })

}

var selectCmts = function(myid, postid, cb){
  var sqlString = "" 

}


var selectNotMyposts = function(myid, cb){
	var sqlString = ""//take exchange language
  var sqlString1 = ""

}


var selectPosts_myfollow = function(myid, myex, cb){
	var sqlString = ""

}

var selectUserLikePost = function(myid, myex, postid, cb){
  var sqlString = ""

}


module.exports = {
	selectPosts_myfollow: selectPosts_myfollow,
	selectMyposts: selectMyposts,
	selectNotMyposts: selectNotMyposts,
  selectCmts: selectCmts,
  selectUserLikePost: selectUserLikePost
}