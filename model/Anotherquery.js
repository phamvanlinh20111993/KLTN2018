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
  console.log("Mysql Connected Another query Successful!");
});


//return sql string date format
var getDateTime = function(date){
	return date.getFullYear() +
                '-' + (date.getMonth() + 1) +
                '-' + (date.getDate()) +
                ' ' + (date.getHours()) +
                ':' + (date.getMinutes()) +
                ':' + (date.getSeconds());
}
/**
	@@idmsg: id cua tin nhan trong table message(tham chieu)
	@@whoeditid: id cua nguoi da sua tin nhan trong table user(tham chieu)
	@@content: noi dung sua tin nhan moi, co thay doi so voi ban cu
	@@ismisselling: check loi chinh ta cua tin nhan nay
**/

var editMessage = function(idmsg, whoeditid, content, ismisselling, cb){

	var sql = "SELECT message_id, whoedit FROM editmessage WHERE message_id="+mysql.escape(idmsg)+
			   " AND whoedit = " + mysql.escape(whoeditid)
	var sqlString = ""

	con.query(sql, function(err, result, fields){
		if (err) throw err;
		else{
			console.log(result)
			if(result.length > 0){

				sqlString = "UPDATE editmessage SET newcontent="+ mysql.escape(content) +
					", ctime='"+ getDateTime(new Date()) + "', misspelling="+mysql.escape(ismisselling)+
					" WHERE message_id = "+mysql.escape(idmsg) +
					" AND whoedit = " + mysql.escape(whoeditid)

			//	console.log("sql "+sqlString)
				con.query(sqlString, function(err1, result1, fields1){
					if(err) cb(null, err1)
					else cb(result1.affectedRows, null)
				})

			}else{//chua co du lieu
				sqlString = "INSERT INTO editmessage(message_id, whoedit, newcontent, misspelling, ctime)"+
					"VALUES("+ mysql.escape(idmsg)+", "+mysql.escape(whoeditid)+ 
					", "+mysql.escape(content)+", "+mysql.escape(ismisselling)+
					", '"+getDateTime(new Date())+"')";

			//	console.log("sql1 "+sqlString)
				con.query(sqlString, function(err1, result1, fields1){
					if(err) cb(null, err1)
					else cb(result1.affectedRows, null)
				})
			}
		}
	})
}

//xoa cac tin nhan trong thoi gian time khi 2 nguoi muon xoa tin nhan
function delMessages(idme, iduser, time)
{
	var sql = "DELETE FROM delconversation WHERE ((whodel = "+ mysql.escape(idme) + 
		      " AND delwho = "+ mysql.escape(iduser) +
			  ") OR ((whodel = "+ mysql.escape(iduser) + " AND delwho = "+
			   mysql.escape(idme)+")) AND "+
			  "time <= " + mysql.escape(time)

	con.query(sql, function (err, result) {
    	if (err) throw err;
    	console.log("Number of records deleted: " + result.affectedRows);
  	});
}

//xoa hoi thoai cua idme voi iduser
var delConversation = function(idme, iduser, cb){
	var sqlString = "SELECT id, time FROM delconversation WHERE "+
				    "whodel = "+ mysql.escape(idme) + " AND delwho = "+ mysql.escape(iduser)

	var sqlString2 = "SELECT id, time FROM delconversation WHERE "+
				     "whodel = "+ mysql.escape(iduser) + " AND delwho = "+ mysql.escape(idme)

    con.query(sqlString, function(err, result, field){
    	if(err) throw err;
    	else{
    		if(result.length > 0){
    			var sqlString1 = "UPDATE delconversation SET time = " + new Date()+ 
    							 " WHERE id = " + mysql.escape(result[0].id)

    			con.query(sqlString1, function(err1, result1, field1){
    				if (err1) throw err1;
    				else {
    					 
				        con.query(sqlString2, function(err2, result2, field2){
				        	if(err2) throw err2;
				        	else{
				        		var d = Date.parse(result[0].time.toString());
                                var d1 = Date.parse(result2[0].time.toString());
                                if(d > d1)
                                	delMessages(idme, iduser, d1)
                                else
                                	delMessages(idme, iduser, d)
				        	}
				        })

    				}
    			})

    		}else{
    			var sqlString1 = "INSERT INTO delconversation(whodel, delwho, time)VALUES( "+
    							 mysql.escape(idme) + ", "+imysql.escape(duser)+", "+new Date()+")"

    			con.query(sqlString1, function(err1, result1, field1){
    				if (err1) throw err1;
    				else{

    					con.query(sqlString2, function(err2, result2, field2){
				        	if(err2) throw err2;
				        	else{
				        		var d = Date.parse(result[0].time.toString());
                                var d1 = Date.parse(result2[0].time.toString());
                                if(d > d1)
                                	delMessages(idme, iduser, d1)
                                else
                                	delMessages(idme, iduser, d)
				        	}
				        })
    				}
    			})

    		}
    	}
    })

}

//tra ve so nguoi trong cong dong cua toi
var selectListUsermyCommunityEx = function(id, cb){
	//select my id, my exchangelanguage
	var sqlstr = "SELECT exchangelg.language_id AS exid FROM "+
			  "exchangelg WHERE exchangelg.user_id = "+ parseInt(id)+
			  " AND prio = 1"

	con.query(sqlstr, function(err, result, fields){
		if(err)	throw err;
		else if(result.length > 0)
		{	
			var ind = 0, orcondi = "";
			if(result.length > 1) orcondi +="("
			while(ind < result.length){
				orcondi += "ex.language_id = "+ result[ind].exid;
				if(ind < parseInt(result.length) - 1)
					orcondi += " OR "
				ind++
			}
			if(result.length > 1) orcondi +=")"

			var sqlString = "SELECT ex.user_id AS id, u.state, ex.language_id FROM exchangelg ex "+
							" JOIN user u ON ex.user_id = u.id "+
							" WHERE "+//"ex.user_id != "+mysql.escape(id) +" AND "+ //comment 12:56AM 13/4
							orcondi+
							" GROUP BY ex.user_id"//add 12:56AM 13/4
            
         //   console.log(sqlString)

		    con.query(sqlString, function(err1, result1, fields1){
		    	if(err1) throw err1;
		    	else  cb(result1)
		    	//console.log(result1)
		    })
		}
	})
}

//tra ve ngon ngu tu nhien va ngon ngu trao doi co do uu tien cao nhat
var select_max_prio_Ex_and_Navtive = function(id, cb){
	var sqlstr = "SELECT la.symbol AS exsy, la.name AS natname, la1.symbol AS natsy,"+
	        " la1.name AS exname FROM exchangelg JOIN language la "+
	        " ON la.id = exchangelg.language_id JOIN nativelg "+
	        " ON exchangelg.user_id = nativelg.user_id JOIN language la1 "+
	        " ON la1.id = nativelg.language_id WHERE exchangelg.user_id = "+ mysql.escape(id)+
	        " AND exchangelg.prio = 1 AND nativelg.prio = 1"+
	        " LIMIT 1"

	con.query(sqlstr, function(err, result, fields){
		if(err) throw err;
		else  cb(result)
	})
}

//lay toan bo exchange language cua nguoi dung (1 nguoi co the trao doi 1 hoac nhieu language)
var selectAllExchangelg = function(id, cb){
	var sqlstr = "SELECT la.id as id, la.symbol AS exsy, la.name AS exname, ex.prio"+
	        " FROM exchangelg ex JOIN language la "+
	        " ON la.id = ex.language_id JOIN user u ON " +
	        " u.id = ex.user_id WHERE u.id = "+ mysql.escape(id)+
	        " ORDER BY ex.prio DESC"

	con.query(sqlstr, function(err, result, fields){
		if(err) throw err;
		else  cb(result)
	})
}

//lay toan bo native language cua nguoi dung (1 nguoi co the co 1 hoac nhieu native language)
var selectAllNativelg = function(id, cb){
	var sqlstr = "SELECT la.id as id, la.symbol AS natsy, la.name AS natname, nat.prio"+
	        " FROM nativelg nat JOIN language la "+
	        " ON la.id = nat.language_id JOIN user u ON " +
	        " u.id = nat.user_id WHERE u.id = "+ mysql.escape(id)+
	        " ORDER BY nat.prio DESC"

	con.query(sqlstr, function(err, result, fields){
		if(err) throw err;
		else  cb(result)
	})
}

//tra ve truong co gia tri lon nhat trong bang
var selectMaxfield = function(tbname, field, cb){
	var sqlstr = "SELECT MAX("+field+") AS max FROM "+tbname
	con.query(sqlstr, function(err, result, fields){
		if(err) throw err;
		else  cb(result)
	})
}

var selectMinfield = function(tbname, field, cb){
	var sqlstr = "SELECT MIN("+field+") AS min FROM "+tbname
	con.query(sqlstr, function(err, result, fields){
		if(err) throw err;
		else  cb(result)
	})
}

//tinh diem cho nguoi dung
var calculateScore = function(id, score, cb)
{
	var sqlString = "UPDATE User SET score = score + "+parseInt(score)+
	 				" WHERE id = "+mysql.escape(id)

	con.beginTransaction(function(err){
		if (err) { 
			throw err; 
			cb(null)
		}

		con.query(sqlString, function(err, result){
			if(err){
		 		con.rollback(function() {
					throw err;
       				cb(null)
      			});
			}

			con.commit(function(err) {
        		if (err) { 
          			con.rollback(function() {
            			throw err;
            			cb(null)
          			});
        		}
        		console.log('Transaction Complete.');

        		var sqlString1 = "SELECT id, score, level_id FROM User "+
		  				   " WHERE id =	" + mysql.escape(id)
        		
        		con.query(sqlString1, function(err1, result1, fields1){
        			if(err1){
        				throw err1
        				cb(null)
        			}else
        			{
        				var userscorenow = result1[0].score
        				if(userscorenow > 99999){
        					var sqlString2 = "SELECT id, level, score FROM level ";
        					con.query(sqlString2, function(err2, result2, fields2){
        						if (err2) {
        							throw err2
        							cb(null)
        						}
        						else{
        							var levelid = 1//level 1
        							for(var ind = 0; ind < result2.length; ind++){
        								if(userscorenow >= result2[ind].score)
        									levelid = result2[ind].level
        								else break;
        							}

        							var sqlString3 = "UPDATE User SET level_id="+mysql.escape(levelid)+
	 				                                 " WHERE id = "+mysql.escape(id)
	 				                con.query(sqlString3, function(err3, result3, fields3){
	 				                	if(err3){
	 				                	    throw err3;
	 				                	    cb(null)
	 				                	}else
	 				                		cb(result3)
	 				                })
        						}
        					})

        				}else
        					cb(result1)
        			}
        		})

      		});
		})
	})
}


module.exports = {
	editMessage: editMessage,
	delConversation: delConversation,
	selectListUsermyCommunityEx: selectListUsermyCommunityEx,
	select_max_prio_Ex_and_Navtive:select_max_prio_Ex_and_Navtive,
	selectAllNativelg: selectAllNativelg,
	selectAllExchangelg: selectAllExchangelg,
	selectMaxfield: selectMaxfield,
	selectMinfield: selectMinfield,
	calculateScore: calculateScore
}
