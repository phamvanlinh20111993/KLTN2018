var mysql = require('mysql');
var con = require('./mysqlconn')

//return sql string date format
var getDateTime = function(date){
	return date.getFullYear() +
         '-' + (date.getMonth() + 1) +
         '-' + (date.getDate()) +
         ' ' + (date.getHours()) +
         ':' + (date.getMinutes()) +
         ':' + (date.getSeconds());
}

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

	//start transaction
	con.beginTransaction(function(err){
		if (err) { 
			throw err; 
			cb(null, err)
		}
		//query
		con.query(sqlString, function(err, result){
			if(err){
				con.rollback(function() {
					throw err;
       				cb(null, err)
      			});
			}

			con.commit(function(err) {
        		if (err) { 
          			con.rollback(function() {
            			throw err;
            			cb(null, err)
          			});
        		}
        		cb(result, null)
        		console.log('Transaction Complete.');
        		//con.end();
      		});
			
		})
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

//	console.log("Query: " + sqlString)
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

	//console.log("Query: " + sqlString)
	//start transaction
	con.beginTransaction(function(err){
		if (err) { 
			con.rollback(function() {
       			cb(null, err)
      		});
		}
		//query
		con.query(sqlString, function(err, result){
			if(err){
				con.rollback(function() {
       				cb(null, err)
      			});
			}  
			con.commit(function(err) {
        		if (err) { 
          			con.rollback(function() {
            			cb(null, err)
          			});
        		}
        		cb(result, null)
            });
		})
	})
}


/* delete table*/
var deleteTable = function(tbname, whcondi, cb){

	var sqlString = "DELETE FROM " + tbname;
	if(whcondi)
	{
		sqlString += " WHERE ";
		var ind = 0;
		while(ind < whcondi.length)
		{
			if(whcondi[ind].op)
				sqlString += " " + whcondi[ind].op + " ";
			sqlString += whcondi[ind].field + " = " + mysql.escape(whcondi[ind].value);
			ind++;
		}
	}

//	console.log("Query: " + sqlString)
   //start transaction
	con.beginTransaction(function(err){
		if(err){
			con.rollback(function(){
    			cb(null, err)
    		})
		}
		con.query(sqlString, function (err, result) {
    		if (err){
    			con.rollback(function(){
    				cb(null, err)
    			})
    		}

    		con.commit(function(err) {
        		if (err) { 
          			con.rollback(function() {
            			cb(null, err)
          			});
        		}
        		cb(result, null)
            });
  		});
	})
}

//tao cau lenh truy van co ban co join bang
var selectTableJoin = function(tbname, data, cb){
	
}


//tra ve thong tin nguoi dung email(params) hien thi trong trang home
var selectUser = function(email, cb){//hien thi nguoi dung
	var sqlString = "SELECT user.id, user.name, user.email, user.photo, user.score,"+
	            " level.level, language.name as exname from user INNER JOIN level "+
				" ON level.id = user.level_id JOIN exchangelg ON (user.id = exchangelg.user_id "+
				" AND exchangelg.prio > 0) JOIN language ON exchangelg.language_id = language.id "+
			    " WHERE user.email = " + mysql.escape(email);
 
	con.query(sqlString, function(err, result, fields){
		if(err)
			cb(null, null, err)
		cb(result, fields, null)
	})		
}

//hien thi tin nhan giua nguoi dung idme va nguoi dung idB
var selectMessage = function(idme, idB, cb){//nhan tin voi nguoi khac(phuc tap)

	var sqlString = "SELECT u.id, u.name, u.photo, u.score" +
	 		    " FROM user u JOIN message me ON (u.id = me.userA OR u.id = me.userB)"+
	 		    " WHERE((me.userA = "+mysql.escape(idme)+" AND me.userB = "+mysql.escape(idB)+")" +
	 			" OR (me.userA = "+mysql.escape(idB)+" AND me.userB = "+mysql.escape(idme)+")) LIMIT 2"//lay thong tin cua moi nguoi

	var Listmessages = {}
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

				//delete conversation
				var sqlString1 = "SELECT del.whodel, del.delwho, del.ctime" +
	                 " FROM delconversation del WHERE del.whodel = " +mysql.escape(idme)+ 
	                 " AND del.delwho = "+mysql.escape(idB)+
	                 " ORDER BY del.ctime DESC LIMIT 1"

	            con.query(sqlString1, function(err1, result1, fields1){
	            	if(err) throw err;
	            	else{

	            		var deltime = ""
	            		console.log(result1)
	            		if(result1.length > 0)
	            			deltime = " AND me.time > '" + getDateTime(new Date(result1[0].ctime))+"'"

	            		//select all message between idme and idB 
							var sqlString2 = "SELECT me.id, me.userA, me.userB, CAST(me.data AS CHAR(100000) CHARACTER SET utf8) AS data, "+
							" me.content, me.misspelling, me.ischeck, me.time, ed.misspelling AS emissspell, " +
						 	" ed.whoedit AS idedit, ed.newcontent AS ncontent, ed.ctime AS ntime "+
						 	" FROM message me LEFT JOIN editmessage ed ON ed.message_id = me.id "+
	 		    		 	" WHERE ((me.userA = "+mysql.escape(idme)+" AND me.userB = "+mysql.escape(idB)+")" +
	 					 	" OR (me.userA = "+mysql.escape(idB)+" AND me.userB = "+mysql.escape(idme)+"))" +
	 					 	deltime +
	 					 	" ORDER BY me.time DESC"

	 					   console.log(sqlString2)

	 					 con.query(sqlString2, function(err2, result2, fields2)
	 					 {
	 						if(err2) cb(err2, null)
	 						else{

	 							Listmessages.messages = []
	 							var ind = 0, ind1 = 0;
	 							var mark = []

	 							for(ind = 0; ind < result2.length; ind++) mark[ind] = 0;

	 							for(ind = 0; ind < result2.length; ind++)
	 							{
	 								if(mark[ind] == 0){
	 									Listmessages.messages[ind] = {}
	 									Listmessages.messages[ind].messageid = result2[ind].id
										Listmessages.messages[ind].idA = result2[ind].userA
										Listmessages.messages[ind].idB = result2[ind].userB

										Listmessages.messages[ind].data = result2[ind].data
										//console.log(result2[ind].data)

										Listmessages.messages[ind].content = result2[ind].content
										Listmessages.messages[ind].time = result2[ind].time
										Listmessages.messages[ind].ischeck = result2[ind].ischeck
										Listmessages.messages[ind].misspelling = result2[ind].misspelling

										var pos = 0;
										Listmessages.messages[ind].edit = []

										if(result2[ind].idedit){
											Listmessages.messages[ind].edit[pos] = {}
											Listmessages.messages[ind].edit[pos].whoedit = result2[ind].idedit 
											Listmessages.messages[ind].edit[pos].newcontent = result2[ind].ncontent
											Listmessages.messages[ind].edit[pos].time = result2[ind].ntime
											Listmessages.messages[ind].edit[pos].misspelling = result2[ind].emissspell
											pos++;
										}else	continue;
							

	 									for(ind1 = ind + 1; ind1 < result2.length; ind1++){
	 										if(result2[ind].id == result2[ind1].id && mark[ind1]== 0){
	 											mark[ind1] = 1;
	 											Listmessages.messages[ind].edit[pos] = {}
	 											Listmessages.messages[ind].edit[pos].whoedit = result2[ind1].idedit 
												Listmessages.messages[ind].edit[pos].newcontent = result2[ind1].ncontent
												Listmessages.messages[ind].edit[pos].time = result2[ind1].ntime
												Listmessages.messages[ind].edit[pos].misspelling = result2[ind1].emissspell
	 											pos++;
	 										}
	 									}
	 								}
	 							}
	 					
	 							cb(null, Listmessages)
	 						}
	 					})

	            	}
	            })

			}else
				cb(null, null)
		}
	})	

}


var loadMessageSetting = function(idme, idB, cb)
{
	var sqlString = "SELECT ch.whocheck, ch.checkwho, ch.ctime FROM checkmisspellings ch" + //select setting from user A and B
					" WHERE ch.whocheck="+mysql.escape(idme)+ " AND ch.checkwho=" + mysql.escape(idB);

	var sqlString1 = "SELECT bl.whoblock, bl.blockwho, bl.ctime FROM blockmessages bl" +
					 " WHERE bl.whoblock="+mysql.escape(idme)+ " AND bl.blockwho=" +mysql.escape(idB)

	var setting = {}
	con.query(sqlString, function(err, result, fields){
		if(err) throw err;
		else{
			if(result.length > 0){
				setting.misspelling = {}
				setting.misspelling.whocheck = result[0].whocheck
				setting.misspelling.checkwith = result[0].checkwho
				setting.misspelling.time = result[0].ctime
			}

			con.query(sqlString1, function(err1, result1, fields1){
				if(err1) throw err1;
				else{
					if(result1.length > 0){
						setting.blockmsg = {}
						setting.blockmsg.whoblock = result1[0].whoblock
						setting.blockmsg.blockwith = result1[0].blockwho
						setting.blockmsg.starttime = result1[0].ctime
					}

					cb(setting)
				}
			})

		}
	})

}


//tra ve full thong tin nguoi dung co ma id
var selectProfile = function(id, cb){//hien thi thong tin profile

	var sqlString = "SELECT u.id, u.name as username, u.email, u.photo, u.score, u.des, u.gender, "+
	                "u.dateofbirth, level.level FROM user u JOIN level on level.id = u.level_id"+
	                " WHERE u.id = " + mysql.escape(id)

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
							 "ON de.id = ex.degree_id WHERE ex.user_id = " + mysql.escape(id) + " ORDER BY ex.prio DESC";

			con.query(sqlString1, function(err, result1, fields){
				if(err) throw err
				else if(result1.length > 0){
					var index = 0;
					userInfor.exlang = {}

					userInfor.exlang.learning = []
					while(index < result1.length)
					{
						userInfor.exlang.learning[index] = {}
						userInfor.exlang.learning[index].exid = result1[index].id
						userInfor.exlang.learning[index].degree = result1[index].dename
						userInfor.exlang.learning[index].langsymbol = result1[index].symbol
						userInfor.exlang.learning[index].langname = result1[index].laname
						index++
					}

					var sqlString2 = "SELECT na.id, la.symbol, la.name as laname FROM nativelg na INNER JOIN " +
									  "language la ON la.id = na.language_id WHERE na.user_id = " + mysql.escape(id) +
									  " ORDER BY na.prio DESC"	

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

//dua ra thong tin trang thai theo doi, follow giua nguoi dung A va B(A la chu the)
var selectWatchUser = function(idA, idB, cb)
{
	var sqlString = "SELECT bol.id AS bolid, bol.ctime AS boltime "+
	            " FROM blocklist_user bol "+
	            " WHERE bol.whoblock = "+mysql.escape(idA)+ " AND bol.blockwho = "+ mysql.escape(idB)
	//console.log(sqlString)

	con.query(sqlString, function(err, result, fields){
		if(err){
		 	throw err
		 	cb(null)
		}else{
			 var watchuser = {
			 	isblock : false,
			 	btime : null,
			 	isfollow : false,
			    ftime : null
			 }

			 if(result.length > 0){
			 	watchuser.isblock = true
			 	watchuser.btime = result[0].boltime
			 }

			 var sqlString1 = "SELECT fo.id AS foid, fo.ctime AS fotime "+
			 		" FROM follow fo "+
			 	    " WHERE fo.followers="+mysql.escape(idA)+ " AND fo.tracked="+ mysql.escape(idB)
			// console.log(sqlString1)

			 con.query(sqlString1, function(err1, result1, fields1){
			 	if(err1){
			 	   throw err1
			 	   cb(null)
			 	}else{
			 		if(result1.length > 0){
			 			watchuser.isfollow = true
			 			watchuser.ftime = result1[0].fotime
			 		}
			 		cb(watchuser)
			 	}
			 })	

		} 
	})

}


//tra ve cong dong nguoi dung su dung native language voi nguoi dung id
var selectUserCommunityNative = function(id, cb){
			//select my id, my exchangelanguage
	var sqlstr = "SELECT user.id, nativelg.language_id as exid FROM user "+
			  " JOIN nativelg ON nativelg.user_id = user.id WHERE user.id = "+ parseInt(id)+
			  " AND nativelg.prio = 1"//co do uu tien cao nhat

	con.query(sqlstr, function(err, resu, fields){
		if(err)	throw err;
		else if(resu.length > 0)
		{
			//console.log(resu)
			var ind = 0, orcondi = "";

			if(resu.length > 1) orcondi +="("
			while(ind < resu.length){
				orcondi += "nat.language_id = "+ resu[ind].exid;
				if(ind < parseInt(resu.length) - 1)
					orcondi += " OR "
				ind++
			}
			if(resu.length > 1) orcondi +=")"

			var searchcondition = ""
		    var morefield = "bll.blockwho AS blockuser1, bll.reason, bll.ctime AS timebluser, ",
		    morejoin = " LEFT JOIN blocklist_user bll ON (bll.whoblock= u.id "+
							" AND bll.blockwho = "+mysql.escape(id)+") "

			var blockusers = " AND u.id not IN(SELECT blockwho from blocklist_user WHERE whoblock="+mysql.escape(id)+")"

			if(searchcd){
				searchcondition = " AND ( u.email LIKE '%" + searchcd+ 
								  "%' OR u.name LIKE '%"+searchcd+"%')"
				blockusers = ""//cho phep tim kiem ca nhung nguoi da blocked
				morefield = "bll.blockwho AS blockuser, bll.reason, bll.ctime AS timebluser, "
				morejoin = " LEFT JOIN blocklist_user bll ON (bll.whoblock="+mysql.escape(id)+
							" AND bll.blockwho = u.id) "
			}

			//all user online and have max lever sorted, max level
			var sqlString = "SELECT u.id, u.name AS uname, u.email, u.des, u.state, bm.whoblock, "+
				" bm.ctime AS timeblock, "+ morefield +
				" u.photo, u.gender, u.score, u.dateofbirth, de.name AS dename, " +
				" la.name AS lname, le.level FROM user u " +
				" JOIN level le ON u.level_id = le.id "+
				" JOIN nativelg nat ON u.id = nat.user_id "+
				" JOIN language la ON la.id = nat.language_id "+
				" JOIN degree de ON ex.degree_id = de.id" +
				" LEFT JOIN blockmessages bm ON (bm.blockwho = "+mysql.escape(id)+" AND bm.whoblock = u.id ) "+
				 morejoin+
				" WHERE u.id != " +mysql.escape(id)+ " AND "+orcondi+" AND ex.prio = 1"+
				 blockusers+
				 searchcondition +
				" ORDER BY u.state DESC, le.level ASC";

			console.log(sqlString)

			con.query(sqlString, function(error, res, fields){
				if(error)	cb(null, error)
				else if(res.length > 0)
					cb(res, null)
				else 
					cb({}, null)
			})
		}
	})
}


//tra ve cong dong nguoi dung su dung exchange language voi nguoi dung id
var selectUserCommunityEx = function(id, searchcd, cb){
	//select my id, my exchangelanguage
	var sqlstr = "SELECT user.id, exchangelg.language_id AS exid FROM user "+
			  " JOIN exchangelg ON exchangelg.user_id = user.id WHERE user.id = "+ parseInt(id)+
			  " AND exchangelg.prio = 1"

	con.query(sqlstr, function(err, resu, fields){
		if(err)	throw err;
		else if(resu.length > 0)
		{
			//console.log(resu)
			var ind = 0, orcondi = "";

			if(resu.length > 1) orcondi +="("
			while(ind < resu.length){
				orcondi += "ex.language_id = "+ resu[ind].exid;
				if(ind < parseInt(resu.length) - 1)
					orcondi += " OR "
				ind++
			}
			if(resu.length > 1) orcondi +=")"

			var searchcondition = ""
		    var morefield = "bll.blockwho AS blockuser1, bll.reason, bll.ctime AS timebluser, ",
		    morejoin = " LEFT JOIN blocklist_user bll ON (bll.whoblock= u.id "+
							" AND bll.blockwho = "+mysql.escape(id)+") "

			var blockusers = " AND u.id not IN(SELECT blockwho from blocklist_user WHERE whoblock="+mysql.escape(id)+")"

			if(searchcd){
				searchcondition = " AND ( u.email LIKE '%" + searchcd+ 
								  "%' OR u.name LIKE '%"+searchcd+"%')"
				blockusers = ""//cho phep tim kiem ca nhung nguoi da blocked
				morefield = "bll.blockwho AS blockuser, bll.reason, bll.ctime AS timebluser, "
				morejoin = " LEFT JOIN blocklist_user bll ON (bll.whoblock="+mysql.escape(id)+
							" AND bll.blockwho = u.id) "
			}

			//all user online and have max lever sorted, max level
			var sqlString = "SELECT u.id, u.name AS uname, u.email, u.des, u.state, bm.whoblock, "+
				" bm.ctime AS timeblock, "+ morefield +
				" u.photo, u.gender, u.score, u.dateofbirth, de.name AS dename, " +
				" la.name AS lname, le.level FROM user u " +
				" JOIN level le ON u.level_id = le.id "+
				" JOIN exchangelg ex ON u.id = ex.user_id "+
				" JOIN language la ON la.id = ex.language_id "+
				" JOIN degree de ON ex.degree_id = de.id" +
				" LEFT JOIN blockmessages bm ON (bm.blockwho = "+mysql.escape(id)+" AND bm.whoblock = u.id ) "+
				 morejoin+
				" WHERE u.id != " +mysql.escape(id)+ " AND "+orcondi+" AND ex.prio = 1"+
				 blockusers+
				 searchcondition +
				" ORDER BY u.state DESC, le.level ASC";

			console.log(sqlString)

			con.query(sqlString, function(error, res, fields){
				if(error)	cb(null, error)
				else if(res.length > 0)
					cb(res, null)
				else 
					cb({}, null)
			})
		}
	})
}

//tra ve danh sach nguoi dung trong messenger voi nhieu nhan tin giua 2 nguoi giam dan
var selectListUserMessengerMaxContent = function(id, cb)
{
	var sqlString = "SELECT u.id, u.email, u.name, u. photo, u.score, count(u.id) AS num"+
	                " FROM user u JOIN message me ON "+
	                " (me.userA = u.id AND me.userB = "+ id +")"+
	                " OR (me.userA = "+ id +" AND me.userB = u.id)"+
	                " WHERE u.id != "+ id +
	                " GROUP BY u.id "+
	                " ORDER BY num DESC"

    con.query(sqlString, function(error, res, fields){
		if(error)	cb(null, error)
		else if(res.length > 0)
			cb(res, null)
	})
}

//tra ve danh sach nguoi dung trong messenger voi thoi gian nt gan nhat voi thoi diem hien tai
//giam dan ve qua khu
var selectListUserMessenger = function(id, cb)
{

	var sqlString = "SELECT u.id, u.email, u.name, u. photo, u.score, u.state, MAX(me.time) AS max, "+
	        " fo.tracked, bl.ctime AS bltime, bl1.ctime AS bl1time "+
	        " FROM user u JOIN message me ON (me.userA = u.id AND me.userB = "+mysql.escape(id)+") "+
	        " OR (me.userA = "+mysql.escape(id)+" AND me.userB = u.id) "+
	        " LEFT JOIN follow fo ON (fo.followers = "+mysql.escape(id)+" AND tracked = u.id)"+
	        " LEFT JOIN blockmessages bl ON bl.whoblock = "+mysql.escape(id)+
	                                        " AND bl.blockwho = u.id "+	//block người khác
	        " LEFT JOIN blockmessages bl1 ON bl1.blockwho = "+mysql.escape(id)+
	               						    " AND bl1.whoblock = u.id "+	//bị block bởi ng khác	
	        " WHERE u.id != "+mysql.escape(id)+
	        " AND u.id not IN(SELECT blockwho from blocklist_user WHERE whoblock = "+mysql.escape(id)+")"+
	        " GROUP BY u.id"+
	        " ORDER BY max DESC, u.state DESC"

	console.log(sqlString)

    con.query(sqlString, function(error, res, fields){
		if(error)	cb(null, error)
		else
			cb(res, null)
	})
}

//tim kiem nguoi dung voi dieu kien email hoac ten nguoi dung
var selectListUserMessengerCondition = function(id, condi, cb)
{

	var sqlString = "SELECT u.id, u.email, u.name, u. photo, u.score, u.state, MAX(me.time) AS max, "+
	        " fo.tracked "+
	        " FROM user u JOIN message me ON (me.userA = u.id AND me.userB = "+mysql.escape(id)+") "+
	        " OR (me.userA = "+mysql.escape(id)+" AND me.userB = u.id) "+
	        " LEFT JOIN follow fo ON (fo.followers = "+mysql.escape(id)+" AND tracked = u.id)"+
	        " WHERE u.id != "+mysql.escape(id)+
	        " AND u.id not IN(SELECT blockwho from blocklist_user WHERE whoblock = "+mysql.escape(id)+")"+
	        " AND ( u.email LIKE '%"+condi+"%' OR u.name LIKE '%"+condi+"%')"+
	        " GROUP BY u.id"+
	        " ORDER BY max DESC, u.state DESC"

	console.log(sqlString)

    con.query(sqlString, function(error, res, fields){
		if(error)	cb(null, error)
		else
			cb(res, null)
	})
}

//load nguoi dung voi ma id cu the
var selectSpecificUserMessenger = function(id, pid, cb)
{
	var sqlString = "SELECT u.id, u.email, u.name, u. photo, u.score, u.state, MAX(me.time) AS max, "+
	        " fo.tracked "+
	        " FROM user u JOIN message me ON (me.userA="+mysql.escape(pid)+" AND me.userB="+mysql.escape(id)+") "+
	        " OR (me.userA="+mysql.escape(id)+" AND me.userB="+mysql.escape(pid)+") "+
	        " LEFT JOIN follow fo ON (fo.followers="+mysql.escape(id)+" AND tracked="+mysql.escape(pid)+")"+
	        " WHERE u.id = "+mysql.escape(pid)+
	        " AND u.id not IN(SELECT blockwho from blocklist_user WHERE whoblock="+mysql.escape(id)+")"+
	        " ORDER BY max DESC, u.state DESC"

	console.log(sqlString)

    con.query(sqlString, function(error, res, fields){
		if(error){
			throw error
			cb(null)
		}
		else if(res.length > 0)
			cb(res)
	})
}


//tra ve danh sach nguoi dung voi userid dung dau
var selectUserMessenger = function(myid, userid, cb)
{
	var sqlString = "SELECT id, email, name, photo, score FROM user WHERE id = " + userid

	con.query(sqlString, function(error, res, fields){
		if(error)	cb(null, error)
		else
		{
			selectListUserMessenger(myid, function(err, data){
				if(err) throw err;
				else{

					var listUserMessenger = []
					listUserMessenger.user[0].id = res[0].id
					listUserMessenger.user[0].email = res[0].email
					listUserMessenger.user[0].name = res[0].name
					listUserMessenger.user[0].photo = res[0].photo
					listUserMessenger.user[0].score = res[0].score

					var ind = 0, pos = 1;
					for(ind = 0; ind < data.length; ind++){
						if(res[0].id != data[ind].id){
							listUserMessenger.user[pos].id = res[ind].id
							listUserMessenger.user[pos].email = res[ind].email
							listUserMessenger.user[pos].name = res[ind].name
							listUserMessenger.user[pos].photo = res[ind].photo
							listUserMessenger.user[pos].score = res[ind].score
							pos++;
						}

					}

					cb(listUserMessenger)
				}
			})
		}
	})
}

//select state is block messages, is follower between uses A, and userB
var selectStateBlockOrFollow = function(myid, userA, cb){
	var sqlString = "SELECT timeblock, ctime"
}

//lay noi dung tin nhan chua doc
var takeMessageContent = function(myid, cb)
{
	var sqlString = "SELECT u.id, u.name AS uname, u.photo, bl.ctime AS bltime,  bl1.ctime AS bltime1, "+//msg.ischeck
				   " (SELECT ischeck from message WHERE time = max(msg.time)) AS ischeck, "+
	               " (SELECT content from message WHERE time = max(msg.time)) AS content,"+
	               " max(msg.time) AS maxtime, msg.data, "+//"COUNT(msg.userA) AS totalmsg "+
	               " (SELECT count(userA) from message WHERE time = max(msg.time) AND ischeck < 2) AS totalmsg"+
	               " FROM message msg "+
	               " JOIN user u ON msg.userA = u.id "+
	               " LEFT JOIN blockmessages bl ON bl.whoblock = "+mysql.escape(myid)+
	               								   " AND bl.blockwho = u.id "+	//block người khác
	               " LEFT JOIN blockmessages bl1 ON bl1.blockwho = "+mysql.escape(myid)+
	               								   " AND bl1.whoblock = u.id "+	//bị block bởi ng khác							   											
	               " WHERE msg.userB = "+mysql.escape(myid)+
	             //  " WHERE (msg.userB = "+mysql.escape(myid)+" AND msg.userA = u.id)"+
	            //   " OR (msg.userA = "+mysql.escape(myid)+" AND msg.userB = u.id)"+
	               " GROUP BY msg.userA "+
	               " ORDER BY msg.time ASC, msg.ischeck ASC"

	console.log(sqlString)
	con.query(sqlString, function(err, result, field){
		if(err){
			throw err
			cb(null)
		}else{
			var contentmsgnotseen = [], isblock, wasblock
			for(var ind = 0; ind < result.length; ind++){
				isblock = false//toi da block ai
				wasblock = false
				if(result[ind].bltime)
					isblock = true
				if(result[ind].bltime1)
					wasblock = true

				contentmsgnotseen[ind] = {
					uid: result[ind].id,
					name: result[ind].uname,
					photo: result[ind].photo,
					msgcontent:  result[ind].content,
					ischeck: result[ind].ischeck,
					isblock: isblock,
					wasblock: wasblock,
					time:  result[ind].maxtime,
					totalmsg:  result[ind].totalmsg
				}
			}

			cb(contentmsgnotseen)
		}
	})
}

//lay so luong tin nhan chua doc
var getNotifyMessage = function(myid, cb){
	var sqlString = " SELECT msg.userA AS id FROM message msg"+
				       " WHERE msg.userB = "+mysql.escape(myid)+" AND msg.ischeck < 2 "+
	                " GROUP BY msg.userA "

	con.query(sqlString, function(err, result, field){
		if(err){
			throw err
			cb(null)
		}else{
			cb(result)
		}
	})
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
	selectListUserMessenger: selectListUserMessenger,
	loadMessageSetting: loadMessageSetting,
	selectWatchUser: selectWatchUser,
	selectSpecificUserMessenger: selectSpecificUserMessenger,
	selectListUserMessengerCondition: selectListUserMessengerCondition,

	takeMessageContent: takeMessageContent,
	getNotifyMessage: getNotifyMessage
}