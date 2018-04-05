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
  console.log("Mysql Connected Querysingle table simple Successful!");
});

/**
  lay danh sach block list cua nguoi dung
**/
var selectMyFollowList = function(id, cb){
	var sqlString = "SELECT u.id, u.email, u.name, u.photo, le.level, fo.ctime "+
					" FROM User u "+
					" JOIN level le ON le.id = u.level_id "+
					" JOIN follow fo ON fo.tracked = u.id "+
					" WHERE fo.followers = "+mysql.escape(id)

	con.query(sqlString, function(err, result){
      if(err){
         throw err
         cb(null)
      }else{
         var blockList = []
         for(var ind = 0; ind < result.length; ind++){
         	blockList[ind] = {
         		id: result[ind].id,
         		email: result[ind].email,
         		name: result[ind].name,
         		photo: result[ind].photo,
         		level: result[ind].level,
         		time: result[ind].ctime
         	}
         }

         cb(blockList)
      }
   })
}

/**
  lay danh sach follow list cua nguoi dung
**/
var selectMyBlockList = function(id, cb){
	var sqlString = "SELECT u.id, u.email, u.name, u.photo, bl.timeblock, bl.ctime "+
					" FROM User u "+
					" JOIN blocklist_user bl ON bl.blockwho = u.id "+
					" WHERE bl.whoblock = "+mysql.escape(id)

	con.query(sqlString, function(err, result){
      if(err){
         throw err
         cb(null)
      }else{
      	 var followList = []
      	 for(var ind = 0; ind < result.length; ind++){
      	 	followList[ind] = {
      	 		id: result[ind].id,
      	 		email: result[ind].email,
      	 		photo: result[ind].photo,
      	 		name: result[ind].name,
      	 		timeblock: result[ind].timeblock,
      	 		time: result[ind].ctime
      	 	}
      	 }

         cb(followList)
      }
   })
}

module.exports = {
	selectMyBlockList: selectMyBlockList,
	selectMyFollowList: selectMyFollowList
}