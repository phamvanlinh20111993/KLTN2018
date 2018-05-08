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

selectUser = function(myid, cb){
	var sqlstr = "SELECT u.id, u.name, u.email, u.photo, u.score, u.gender, u.provider, bl.timeblock AS bltime, "+
				 " bl.time AS time FROM user u"+
				 " LEFT JOIN blocklist_admin bl ON bl.blockwho = u.id"+
				 " WHERE u.id != "+myid +
				 " ORDER BY u.name DESC"

	con.query(sqlstr, function(err, result){
		if(err)
			cb(null, err)
		else{
			var user = [], timebl, pos = 0;
			for(var ind = 0; ind < result.length; ind++){
				timebl = null;
				var time = 0 
				if(result[ind].bltime)
					timebl = (new Date(result[ind].bltime) - new Date(result[ind].time))/31536000000

				if(timebl){
					if(timebl > 50){
						continue
					}else
						time = timebl*31536000000
				}
				user[pos] = {
					id: result[ind].id,
					name: result[ind].name, 
					email: result[ind].email,
					photo: result[ind].photo,
					score: result[ind].score,
					gender: result[ind].gender,
					provider: result[ind].provider,
					block: time
				}
				pos++
			}

			cb(user, null)
		}
		
	}) 
}


var selectReportPost = function(myid, cb){
	var sqlstr = "SELECT u.name AS unamerp, u.id AS uirp, rp.post_id AS pid, rp.time, rp.state,  "+
					 " u1.name AS unamewrp, u1.id AS uidwrp, u1.email AS uemailwrp, rpc.content "+
					 " FROM report_post_comment rp "+
					 " JOIN user u ON rp.whoreport = u.id "+
					 " JOIN report_post_comment_content rpc ON "
					 " JOIN post p ON p.id = rp.post_id"+
					 " JOIN user u1 ON u1.id = p.user_id "//+
					// " WHERE rp.whoreport != "+mysql.escape(myid)

	con.query(sqlstr, function(err, result){
		if(err)
			cb(null, err)
		else{
			var report = [];
			for(var ind = 0; ind < result.length; ind++){
				
				report[ind] = {
					namerp: result[ind].unamerp,
					idrp: result[ind].uirp,
					pid: result[ind].pid, 
					time: result[ind].time,
					state: result[ind].state,
					namewrp: result[ind].unamewrp,
					gender: result[ind].gender,
					idwrp: result[ind].uidwrp,
					emailwrp: result[ind].uemailwrp,
					content: result[ind].content
				}
			}

			cb(report, null)
		}
		
	}) 
}

var selectReportUser = function(myid, tbname, tbname1, cb){
	var sqlstr = "SELECT u.name AS unamerp, u.id AS uirp, rp.post_id AS pid, rp.time, rp.state,  "+
					 " u1.name AS unamewrp, u1.id AS uidwrp, u1.email AS uemailwrp, ty.name AS tyname "+
					 " FROM "+tbname+" rp "+
					 " JOIN user u ON rp.whoreport = u.id "+
					 " JOIN type ty ON ty.id = rp.type "
					 " JOIN user u1 ON u1.id =  rp.reportwho "//+
					// " WHERE rp.whoreport != "+mysql.escape(myid)

	con.query(sqlstr, function(err, result){
		if(err)
			cb(null, err)
		else{
			var report = [];
			for(var ind = 0; ind < result.length; ind++){
				report[ind] = {
					namerp: result[ind].unamerp,
					time: result[ind].time,
					state: result[ind].state,
					namewrp: result[ind].unamewrp,
					gender: result[ind].gender,
					idwrp: result[ind].uidwrp,
					emailwrp: result[ind].uemailwrp,
					type: result[ind].tyname,
					content: "Report về "+ result[ind].tyname
				}
			}

			cb(report, null)
		}
		
	}) 
}


module.exports = {
	selectUser: selectUser,
	selectReportPost: selectReportPost,
	selectReportUser: selectReportUser
}