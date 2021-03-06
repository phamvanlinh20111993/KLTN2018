var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')


function getDateTime(date, addblocktime)
{
	date.setDate(date.getDate() + addblocktime)//auto block messages with 15 days
    return date.getFullYear() +
     '-' + (date.getMonth() + 1) +
     '-' + (date.getDate()) +
     ' ' + (date.getHours()) +
     ':' + (date.getMinutes()) +
     ':' + (date.getSeconds());
}

router.route('/user/allnat')
.post(function(req, res)
{
	if(req.session.user_id){
		anotherquery.selectAllNativelg(req.session.user_id, function(data){
			res.send(JSON.stringify({allnat: data}))
		})
	}
})


router.route('/user/allex')
.post(function(req, res)
{
	if(req.session.user_id){
		anotherquery.selectAllExchangelg(req.session.user_id, function(data){
			res.send(JSON.stringify({allex: data}))
		})
	}
})


router.route('/user/allreport')
.post(function(req, res)
{
	if(req.session.user_id){
		querysimple.selectTable("report_user_content", ["id", "code", "content"], 
			null, null, null, null, function(result, fields, err){
				if(err)	throw err
				else{
				//	console.log(result)
					res.send(JSON.stringify({report: result}))
				}
			})
	}
})



router.route('/user/changetrasprio')
.put(function(req, res){

	if(req.session.filter){
		var idlg = parseInt(req.body.data.data)
		if(idlg){
			var field = [{field: "prio", value: 0}]
			var wherecondition = [{op: "", field: "user_id", value: req.session.user_id}]
			//change prio to 0(no priority)
			querysimple.updateTable("nativelg", field, wherecondition, function(result, err){
				if (err) {throw err}
				else{
					var field1 = [{field: "prio", value: 1}]
					var wherecond = [{op: "", field: "user_id", value: req.session.user_id}, 
					{op: "AND", field: "language_id", value: idlg}]

					querysimple.updateTable("nativelg", field1, wherecond, function(result1, err1){
						if (err1) {throw err1}
						else{

							querysimple.selectTable("language", ["id", "name", "symbol"], 
							 [{op: "", field: "id", value: idlg}], null, null, null, 
							 function(result3, fields3, err3){
							 	if (err3) { throw err3}
							 	else{
									req.session.mynative = result3[0].symbol
									req.session.mynativeid = result3[0].id
							        res.send(JSON.stringify({notify: "Done"}))
								}
							})
						}
					})

					
				}
			})
		}
		
	}
})


router.route('/user/changemissprio')
.put(function(req, res){

	if(req.session.filter){
		var idlg = parseInt(req.body.data.data)
		if(idlg){
			var field = [{field: "prio", value: 0}]
			var wherecondition = [{op: "", field: "user_id", value: req.session.user_id}]
			//change prio to 0(no priority)
			querysimple.updateTable("exchangelg", field, wherecondition, function(result, err){
				if (err) {throw err}
				else{
					var field1 = [{field: "prio", value: 1}]
					var wherecond = [{op: "", field: "user_id", value: req.session.user_id}, 
					{op: "AND", field: "language_id", value: idlg}]

					querysimple.updateTable("exchangelg", field1, wherecond, function(result1, err1){
						if (err1) {throw err1}
						else{
							querysimple.selectTable("language", ["id", "name", "symbol"], 
							 [{op: "", field: "id", value: idlg}], null, null, null, 
							 function(result3, fields3, err3){
							 	if (err3) { throw err3}
							 	else{
							 		req.session.myexchange = result3[0].symbol
							 		req.session.myexchangeid = result3[0].id
									res.send(JSON.stringify({notify: "Done"}))
								}
							})
						}
					})
					
				}
			})
		}
	}
})


router.route('/user/report')
.post(function(req, res){

	if(req.session.filter){
		//update database
		var whoreport = req.body.whid
		var reportwho = req.body.rpw 
		var time = new Date (req.body.time)
		var code = req.body.code;
		if(code){
			for(var ind = 0; ind < code.length; ind++){
				var field = ["whoreport", "reportwho", "code", "state", "time"]
				var value = [whoreport, reportwho, code[ind], 0, time]
				querysimple.insertTable("report_user", field, value, function(result, err){
					if (err) {throw err}
					else{
						console.log("Inserted " + result.affectedRows + " rows")
					}
				})
			}
		}
	
		res.send(JSON.stringify({notify: "Done"}))
	}
})

//xoa hoi thoai
router.route('/user/delconversation')
.delete(function(req, res){

	if(req.session.filter){
		var id = req.body.id
		var time = new Date(req.body.time)

		if(id && time){
			querysimple.selectTable("delconversation", ["id"], 
				[{op:"", field: "whodel", value: req.session.user_id }, {op:"AND", field: "delwho", value: id}],
			null, null, null, function(result, fields, err){
				if(err) throw err
				else{
					if (result.length > 0) {
						querysimple.updateTable("delconversation", [{field: "ctime", value: time}], 
							[{op: "", field: "whodel", value: req.session.user_id}, 
							{op: "AND", field: "delwho", value: id}], function(result1, err1){
								if (err1) {throw err1}
							   else res.json({data: "Updated " + result1.affectedRows + " rows"})
							})
					}else{
						var field = ["whodel", "delwho", "ctime"]
						var value = [req.session.user_id, id, time]
						querysimple.insertTable("delconversation", field, value, function(result1, err1){
							if (err1) {throw err1}
							else res.json({data: "Inserted " + result1.affectedRows + " rows"})
						})
					}
				}
			})
			
		}
	}
})


router.route('/user/uncheckmiss')
.post(function(req, res){

	if(req.session.filter){
		querysimple.selectTable("checkmisspellings", ["id"], 
			[{op: "", field: "whocheck",value: req.session.user_id}, 
			  {op: "AND", field: "checkwho", value: parseInt(req.body.id)}], null, null, null, 
		 function(result, fields, err){
		 	if(err) throw err;
		 	else{
		 		if(result.length == 0){
		 			var field = ["whocheck", "checkwho", "ctime"]
		 			var value = [req.session.user_id, parseInt(req.body.id), new Date()]
		 			querysimple.insertTable("checkmisspellings",field, value, function(data, err){
		 					if (err) throw err;
		 					else res.json({data: result.affectedRows})
		 				})
		 		}else
		 			res.json({data: "checked."})
		 	} 
	     })
	}
})

router.route('/user/checkmiss')
.post(function(req, res){

	if(req.session.filter){
		if(req.session.filter){
		querysimple.selectTable("checkmisspellings", ["id"], 
			[{op: "", field: "whocheck",value: req.session.user_id}, 
			  {op: "AND", field: "checkwho", value: req.body.id}], null, null, null, 
		 function(result, fields, err){
		 	if(err) throw err;
		 	else{
		 		if(result.length > 0){
		 			querysimple.deleteTable("checkmisspellings", [{op: "", field: "whocheck",value: req.session.user_id},
		 				{op: "AND", field: "checkwho",value: parseInt(req.body.id)}], function(data, err){
		 					if (err) throw err;
		 					else res.json({data: result.affectedRows})
		 				})
		 		}else
		 			res.json({data: "you unchecked this."})
		 	}
	     })
	}
	}
})


router.route('/user/blockmsg')
.post(function(req, res){

	if(req.session.filter){
		querysimple.selectTable("blockmessages", ["id"], 
			[{op: "", field: "whoblock",value: req.session.user_id}, 
			  {op: "AND", field: "blockwho", value: parseInt(req.body.id)}], null, null, null, 
		 function(result, fields, err){
		 	if(err) throw err;
		 	else{
		 		if(result.length == 0){
		 			var field = ["whoblock", "blockwho", "ctime"]
		 			var value = [req.session.user_id, parseInt(req.body.id), new Date()]
		 			querysimple.insertTable("blockmessages",field, value, function(data, err){
		 					if (err) throw err;
		 					else res.json({data: result.affectedRows})
		 				})
		 		}else
		 			res.json({data: "blocked."})
		 	} 
	     })
	}
})

router.route('/user/unblockmsg')
.post(function(req, res){

	if(req.session.filter){
		querysimple.selectTable("blockmessages", ["id"], 
			[{op: "", field: "whoblock",value: req.session.user_id}, 
			  {op: "AND", field: "blockwho", value: req.body.id}], null, null, null, 
		 function(result, fields, err){
		 	if(err) throw err;
		 	else{
		 		if(result.length > 0){
		 			querysimple.deleteTable("blockmessages", [{op: "", field: "whoblock",value: req.session.user_id},
		 				{op: "AND", field: "blockwho",value: parseInt(req.body.id)}], function(data, err){
		 					if (err) throw err;
		 					else res.json({data: result.affectedRows})
		 				})
		 		}else
		 			res.json({data: "not allowed"})
		 	}
	     })
	}
})


router.route('/user/seenmessage')
.post(function(req, res){

	var pid = req.body.data.pid
	if(req.session.user_id && pid)
	{
		querysimple.updateTable("message", [{field: "ischeck", value: 2}], 
         [{op: "", field: "userA", value: parseInt(pid)}, 
          {op:"AND", field: "userB", value: req.session.user_id}],
         function(result, err){
            if(err)   throw err
            else{
               console.log(result.affectedRows + " record(s) updated seen message in server");
               res.json({data: result})
            }
         })
	}
})

module.exports = router;