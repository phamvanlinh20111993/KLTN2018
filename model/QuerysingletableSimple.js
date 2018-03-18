var mysql = require('mysql');

var con = mysql.createConnection({
  connectionLimit : 10,
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

/* insert table */
var insertString = function(tbname, field, value, cb)
{
	var sqlString = "INSERT INTO " + tbname + "(";
	var ind = 0;

	//set fields
	while(ind < field.length){
		sqlString += field[ind]
		if(ind < field.length - 1)
			sqlString += ", ";
		ind++;
	}

	sqlString += " )VALUES( "

	//set value
	ind = 0;
	while(ind < value.length){
		sqlString += mysql.escape(value[ind])//sql injection
		if(ind < value.length - 1)
			sqlString += ", ";
		ind++;
	}

	sqlString += " )";
	
	console.log("Query: " + sqlString)

	//query
	con.query(sqlString, function(err, result){
		if(err)
			cb(null, err)
		cb(result, null)
	})
}


/* select from table */
var selectTable = function(tbname, field, whcondi, ordcondi, grcondi, limitcondi, cb)
{
	var sqlString = "SELECT ";
	var pos = 0;

	while(pos < field.length){
		sqlString +=  field[pos]
		if(pos < field.length - 1)
			sqlString += ", ";
		pos++;
	}

	sqlString += " FROM " + tbname;	

	if(whcondi){
		sqlString += " WHERE "
		pos = 0;
		while(pos < whcondi.length){
			if(whcondi[pos].op)
				sqlString += " " + whcondi[pos].op + " ";
			sqlString += whcondi[pos].field + " = " + mysql.escape(whcondi[pos].value);
			pos++;
		}
	}

	if(grcondi){
		sqlString += " GROUP BY ";
		pos = 0;
		while(pos < grcondi.length){
			sqlString += grcondi[pos];
			if(pos < grcondi.length - 1)
				sqlString += ", ";
			pos++;
		}
	}

	if(ordcondi){
		sqlString += " ORDER BY ";
		pos = 0;
		while(pos < ordcondi.length){
			sqlString += ordcondi[pos].field + " " + ordcondi[pos].op;
			if(pos < ordcondi.length - 1)
				sqlString += ", ";
			pos++;
		}
	}

	if(limitcondi)
		sqlString += " LIMIT " + parseInt(limitcondi);

	console.log("Query: " + sqlString)
	//query
	con.query(sqlString, function(err, result, fields){
		if(err)
			cb(null, null, err)
		cb(result, fields, null)
	})
}

/*Update  from table*/
var updateTable = function(tbname, fields, whcondi, cb)
{

	var sqlString = "UPDATE " + tbname + " SET ";
	var ind = 0;
	while(ind < fields.length){
		sqlString += fields[ind].field + "=" + mysql.escape(fields[ind].value)
		if(ind < fields.length - 1)
			sqlString += ", ";
		ind++;
	}

	if(whcondi){
		sqlString += " WHERE "
		ind = 0;
		while(ind < whcondi.length){
			if(whcondi[ind].op)
				sqlString += " " + whcondi[ind].op + " ";
			sqlString += whcondi[ind].field + "=" + mysql.escape(whcondi[ind].value);
			ind++;
		}
	}

	console.log("Query: " + sqlString)
	//query
	con.query(sqlString, function(err, result){
		if(err)
			cb(null, err)
		cb(result, null)
	})
}


/* delete table*/
var deleteTable = function(tbname, whcondi, cb){

	var sqlString = "DELETE " + tbname;

	if(whcondi)
	{
		sqlString = " WHERE ";
		var ind = 0;
		while(ind < whcondi.length)
		{
			if(whcondi[ind].op)
				sqlString += "  " + whcondi[ind].op + " ";
			sqlString += whcondi[ind].field + " = " + mysql.escape(whcondi[ind].value);
			ind++;
		}
	}

	console.log("Query: " + sqlString)

	con.query(sqlString, function (err, result) {
    	if (err)
    		cb(null, err)
    	cb(result, null)
  });
}

//tao cau lenh truy van co ban co join bang
var selectTableJoin = function(tbname, data, cb){

}


//tra ve thong tin nguoi dung email(params) hien thi trong trang home
var selectUser = function(email, cb){//hien thi nguoi dung
	var sqlString = "select user.id, user.name, user.email, user.photo,user.score, level.level from user inner join level "+
				"on level.id = user.level_id where user.email = " + mysql.escape(email);

	con.query(sqlString, function(err, result, fields){
		if(err)
			cb(null, null, err)
		cb(result, fields, null)
	})		
}

//hien thi tin nhan giua nguoi dung idme va nguoi dung idB
var selectMessage = function(idme, idB, cb){//nhan tin voi nguoi khac(phuc tap)

	var sqlString = "SELECT u.id, u.name, u.photo, u.score	" +
	 		    "FROM user u JOIN message me ON (u.id = me.userA OR u.id = me.userB)"+
	 		    " WHERE((me.userA = "+mysql.escape(idme)+" AND me.userB = "+mysql.escape(idB)+")" +
	 			" OR (me.userA = "+mysql.escape(idB)+" AND me.userB = "+mysql.escape(idme)+")) LIMIT 2"//lay thong tin cua moi nguoi

	var Listmessages = []
	con.query(sqlString, function(err, result, fields){
		if(err) throw err;
		else{
			if(result.length > 0){
				Listmessages.userA = {}
				Listmessages.userA.id = result[0].id
				Listmessages.userA.name = result[0].name
				Listmessages.userA.photo = result[0].photo
				Listmessages.userA.score = result[0].score

				Listmessages.userB = {}
				Listmessages.userB.id = result[1].id
				Listmessages.userB.name = result[1].name
				Listmessages.userB.photo = result[1].photo
				Listmessages.userB.score = result[1].score

				var sqlString1 = "SELECT del.whodel, del.delwho, del.time" +
	                 " FROM delconversation del WHERE del.whodel = " +mysql.escape(idme)+ 
	                 " AND del.delwho = "+mysql.escape(idB)+
	                 " ORDER BY del.time DESC LIMIT 1"


				var sqlString2 = "SELECT me.id, me.userA, me.userB, me.data, me.content, "+
						" me.check, me.time FROM message me"+
	 		    		" WHERE((me.userA = "+mysql.escape(idme)+" AND me.userB = "+mysql.escape(idB)+")" +
	 					" OR (me.userA = "+mysql.escape(idB)+" AND me.userB = "+mysql.escape(idme)+"))" +
	 					"ORDER BY time DESC"

	 			con.query(sqlString2, function(err, result, fields){

	 			})

			}else
				cb(null, null)
		}
	})	

}


var loadMessageSetting = function(idme, idB, cb)
{
	var sqlString = "SELECT ch.whocheck, ch.value, cl.checkwho FROM checkmisspellings ch " + //select setting from user A and B
					"WHERE ch.whocheck = "+mysql.escape(idme)+ " AND ch.checkwho = " + mysql.escape(idB);

	var sqlString1 = "SELECT bl.whoblock, bl.blockwho, bl.time FROM blockmessages FROM " +
					 "WHERE bl.whoblock = "+mysql.escape(idme)+ " AND bl.whocheck = " +mysql.escape(idB)

	var setting = {}
	con.query(sqlString, function(err, result, fields){
		if(err) throw err;
		else{
			if(result.length > 0){
				setting.misspelling = {}
				setting.misspelling.whocheck = result[0].whocheck
				setting.misspelling.checkwith = result[0].checkwho
				setting.misspelling.value = result[0].value
			}

			con.query(sqlString1, function(err1, result1, fields1){
				if(err1) throw err1;
				else{
					if(result1.length > 0){
						setting.blockmsg = {}
						setting.blockmsg.whoblock = result2[0].whoblock
						setting.blockmsg.blockwith = result2[0].blockwho
						setting.misspelling.starttime = result2[0].time
					}

					cb(setting)
				}
			})

		}
	})

}


//tra ve full thong tin nguoi dung id
var selectProfile = function(id, cb){//hien thi thong tin profile

	var sqlString = "SELECT u.id, u.name as username, u.email, u.photo, u.score, u.des, u.gender, "+
	                "u.dateofbirth, level.level FROM user u JOIN level on level.id = u.level_id"+
	                " WHERE u.id = " + id

	var userInfor = {}
	con.query(sqlString, function(err, result, fields){
		if(err)  throw err;
		else if(result.length > 0){
			userInfor.infor = {}
			userInfor.infor.id = result[0].id
			userInfor.infor.name = result[0].username
			userInfor.infor.email = result[0].email
			userInfor.infor.photo = result[0].photo
			userInfor.infor.score = result[0].score
			userInfor.infor.describe = result[0].des
			userInfor.infor.gender = result[0].gender
			userInfor.infor.dateofbirth = result[0].dateofbirth
			userInfor.infor.level = result[0].level

			var sqlString1 = "SELECT ex.id, de.name as dename, la.symbol, la.name as laname FROM exchangelg  " +
							 "ex INNER JOIN language la ON la.id = ex.language_id INNER JOIN degree de " +
							 "ON de.id = ex.degree_id WHERE ex.user_id = " + id + " ORDER BY la.name DESC";

			con.query(sqlString1, function(err, result1, fields){
				if(err) throw err
				else if(result1.length > 0){
					var index = 0;
					userInfor.exlang = {}

					userInfor.exlang.learning = []
					while(index < result.length)
					{
						userInfor.exlang.learning[index] = {}
						userInfor.exlang.learning[index].exid = result1[index].id
						userInfor.exlang.learning[index].degree = result1[index].dename
						userInfor.exlang.learning[index].langsymbol = result1[index].symbol
						userInfor.exlang.learning[index].langname = result1[index].laname
						index++
					}

					var sqlString2 = "SELECT na.id, la.symbol, la.name as laname FROM nativelg na INNER JOIN " +
									  "language la ON la.id = na.language_id WHERE na.user_id = " + id +
									  " ORDER BY la.name DESC"	

					con.query(sqlString2, function(err, result2, fields){
						if(err)
							cb(null, err)
						else if(result2.length > 0){
							var ind = 0;
							userInfor.natlang = {}
							userInfor.natlang.learning = []

							while(ind < result2.length)
							{
								userInfor.natlang.learning[ind] = {}
								userInfor.natlang.learning[ind].natid = result2[ind].id
								userInfor.natlang.learning[ind].langsymbol = result2[ind].symbol
								userInfor.natlang.learning[ind].langname = result2[ind].laname
								ind++
							}

							cb(userInfor, null)
						}
					})
				}
			})
		}
		
	})	
}


//tra ve cong dong nguoi dung su dung exchange language voi nguoi dung id
var selectUserCommunityEx = function(id, cb){
	//select my id, my nativelanguage
	var sqlstr = "SELECT user.id, nativelg.language_id as natid FROM user "+
			  "JOIN exchangelg ON nativelg.user_id = user.id WHERE user.id = "+id

	con.query(sqlstr, function(err, resu, fields){
		if(err)	throw err;
		else if(resu.length > 0)
		{
			console.log(resu)
			var ind = 0, orcondi = "";

			if(resu.length > 1) orcondi +="("
			while(ind < resu.length){
				orcondi += "nat.language_id != "+ resu[ind].natid;
				if(ind < parseInt(resu.length) - 1)
					orcondi += " OR "
				ind++
			}
			if(resu.length > 1) orcondi +=")"

			//all user online and have max lever sorted, max level
			var sqlString = "SELECT u.id, u.name AS uname, u.des, u.state, "+
				"u.photo, u.gender, u.score, la.name AS lname, le.level FROM user u " +
				"JOIN level le ON u.level_id = le.id JOIN nativelg nat ON u.id = nat.user_id "+
				"JOIN language la ON la.id = nat.language_id " +
				"WHERE u.id != " +id+ " AND "+orcondi+" AND "+
				"u.id not IN(SELECT blockwho from blocklist_user WHERE whoblock = "+id+")"+
				" ORDER BY u.state DESC, le.level ASC";
			
			con.query(sqlString, function(error, res, fields)
			{
				if(error)	cb(null, error)
				else if(res.length > 0)
					cb(res, null)
			})
		}
	})
	
}


//tra ve cong dong nguoi dung su dung native language voi nguoi dung id
var selectUserCommunityNative = function(id, cb){
	//select my id, my exchangelanguage
	var sqlstr = "SELECT user.id, exchangelg.language_id as exid FROM user "+
			  "JOIN exchangelg ON exchangelg.user_id = user.id WHERE user.id = "+ parseInt(id)

	con.query(sqlstr, function(err, resu, fields){
		if(err)	throw err;
		else if(resu.length > 0)
		{
			console.log(resu)
			var ind = 0, orcondi = "";

			if(resu.length > 1) orcondi +="("
			while(ind < resu.length){
				orcondi += "ex.language_id = "+ resu[ind].exid;
				if(ind < parseInt(resu.length) - 1)
					orcondi += " OR "
				ind++
			}
			if(resu.length > 1) orcondi +=")"

			//all user online and have max lever sorted, max level
			var sqlString = "SELECT u.id, u.name AS uname, u.des, u.state, "+
				"u.photo, u.gender, u.score, de.name AS dename, " +
				" la.name AS lname, le.level FROM user u " +
				"JOIN level le ON u.level_id = le.id JOIN exchangelg ex ON u.id = ex.user_id "+
				"JOIN language la ON la.id = ex.language_id JOIN degree de ON " +
				"ex.degree_id = de.id WHERE u.id != " +id+ " AND "+orcondi+" AND "+
				"u.id not IN(SELECT blockwho from blocklist_user WHERE whoblock = "+id+")"+
				" ORDER BY u.state DESC, le.level ASC";

			con.query(sqlString, function(error, res, fields)
			{
				if(error)	cb(null, error)
				else if(res.length > 0)
					cb(res, null)
			})
		}
	})
}


var selectListUserMessenger = function(id, cb){//tra ve danh sach nguoi dung trong messenger
	var sqlString = "SELECT "

}

var selectUserMessenger = function(userid, cb){
	var sqlString = "SELECT "
}


module.exports = {
	insertTable: insertString,
	selectTable: selectTable,
	updateTable: updateTable,
	deleteTable: deleteTable,

	selectUser: selectUser,
	selectProfile: selectProfile,
	selectUserCommunityNative: selectUserCommunityNative,
	selectUserCommunityEx: selectUserCommunityEx,
	selectTableJoin: selectTableJoin,
	selectMessage: selectMessage,
	selectListUserMessenger: selectListUserMessenger
}