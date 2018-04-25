var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')
var profilequery = require('../../model/Profilequery')


router.route('/user/updateinfo')
.post(function(req, res){

	if(req.session.filter){
		
	}
})

router.route('/user/myfollowers')
.post(function(req, res){

	if(req.session.filter){
		var myid = req.body.data.id
		if(myid && myid == req.session.user_id){
			profilequery.selectMyFollowList(myid, function(data){
				console.log(data)
				res.json({data: data})
			})
		}
	}
})


router.route('/user/myblocklists')
.post(function(req, res){

	if(req.session.filter){
		var myid = req.body.data.id
		if(myid && myid == req.session.user_id){
			profilequery.selectMyBlockList(req.session.user_id, function(data){
				console.log(data)
				res.json({data: data})
			})
		}
	}
})

router.route('/user/blockuser')
.post(function(req, res){
	if(req.session.filter){
		var pid = req.body.data.id
		var reason = req.body.data.reason
		var time = req.body.data.time
		querysimple.selectTable("blocklist_user", ["id"], [{op: "", field: "whoblock", value: req.session.user_id},
		  {op: "AND", field: "blockwho", value: pid}], null, null, null, function(result, fields, err){
		  	  if(err) throw err
		  	  else{
		  	  	if(result.length == 0){

		  	  		 var time1 = new Date(time)//auto block 1 years
		  	  		 time1.setDate(time1.getDate()+365)

		  	  		 var field = ["whoblock", "blockwho", "reason", "timeblock", "ctime"]
		  	  		 var value = [req.session.user_id, pid, reason, time1, new Date(time)]
		  	  		 querysimple.insertTable("blocklist_user", field, value, function(result, err){
		  	  		 	if(err) throw err;
		  	  		 	else
		  	  		 		res.json({data: result.affectedRows})
		  	  		 })
		  	  	}else{
		  	  		res.json({data: "You blocked this users."})
		  	  	}
		  	  }
		  	 
		  })
		
	}
})


router.route('/user/unblockuser')
.delete(function(req, res){
	if(req.session.filter){
		var pid = req.body.data.id
		querysimple.selectTable("blocklist_user", ["id"], [{op: "", field: "whoblock", value: req.session.user_id},
		  {op: "AND", field: "blockwho", value: pid}], null, null, null, function(result, fields, err){
		  	  if(err) throw err
		  	  else{
		  	  	if(result.length > 0){
		  	  		 querysimple.deleteTable("blocklist_user", 
		  	  		 	[{op: "", field: "whoblock", value: req.session.user_id}, 
		  	  		 		{op: "AND", field:"blockwho", value: pid}], 
		  	  		 	function(result, err){
		  	  		 		if(err) throw err
		  	  		 		else
		  	  		 			res.json({data: result.affectedRows})
		  	  		 })
		  	  	}else{
		  	  		res.json({data: "You unblocked this users."})
		  	  	}
		  	  }
		  	 
		  })
	}
})

//get report content to profle user
router.route('/user/loadrpprofile')
.post(function(req, res){
	if(req.session.user_id){
		querysimple.selectTable("report_profile_content", ["id", "code", "content"],
			null, null, null, null, function(result, fields, err){
			if(err) throw err
			else{
			 	res.json({data: result})
			}
		})
	}
})

//receive report of user
router.route('/user/reportprofile')
.post(function(req, res){
	if(req.session.user_id){
		console.log(req.body)
		var whorp = req.body.data.whorppr
		var rpwho = req.body.data.rpw
		var code = req.body.data.code
		var time = new Date(req.body.data.time)
		if(code){
			for(var ind = 0; ind < code.length; ind++){
				var field = ["whoreport", "reportwho", "code", "state", "time"]
				var value = [whorp, rpwho, code[ind], 0, time]//2 is type of post
				querysimple.insertTable("report_profile", field, value, function(result, err){
					if (err) {throw err}
					else{
						console.log("Inserted " + result.affectedRows + " rows")
					}
				})
			}
			res.json({notify: "Done"})
		}
	}
})

//load my exchange language and language
router.route('/user/loadexchange')
.post(function(req, res){
	if(req.session.user_id){
		profilequery.selectMyExAndLanguage(req.session.user_id, function(data){
			res.json({result: data})
		})
	}
})

//load my native language and language
router.route('/user/loadnative')
.post(function(req, res){
	if(req.session.user_id){
		profilequery.selectMyNatAndLanguage(req.session.user_id, function(data){
			res.json({result: data})
		})
	}
})

//router for edit information
router.route('/user/edit')
.post(function(req, res){
	if(req.session.user_id){
		console.log(req.body)
		var describe = req.body.describe
		var name = req.body.name
		var gender = req.body.gender
		var bday = req.body.bday
		//update database
		if(describe && name && gender && bday){
			var fields = [{field: "name", value: name}, {field: "gender", value: gender},
			{field: "dateofbirth", value: bday}, {field: "des", value: describe}]

			var wherecondition = [{op:"", field: "id", value: req.session.user_id}]

			querysimple.updateTable("user", fields, wherecondition, function(result, err){
				if(err) throw err
				else 
					res.redirect('/languageex/user/profile?uid='+encodeURIComponent(req.session.user_id))
			})
		}
	}
})

//change password
router.route('/user/changepass')
.post(function(req, res){
	if(req.session.user_id){
		var newpass = req.body.data.npass
		if(req.session.password){
			if(newpass){
				var updatepass = CryptoJS.AES.encrypt((req.session.email), md5(newpass)).toString()
				var field = [{field: "password", value: updatepass}]
				var wherecondition = [{op:"", field: "id", value: req.session.user_id}]

				querysimple.updateTable("user", field, wherecondition, function(result, err){
					if(err) throw err
					else 
						res.json({result: 110000})
				})
			}
		}else
			res.json({result: 110001})
	}
})

//check old pass user
router.route('/user/checkpass')
.post(function(req, res){
	if(req.session.user_id){
		var oldpass = req.body.data.pass
		if(!req.session.password){//han che truy van csdl
			querysimple.selectTable("user", ["password"], [{op:"", field: "id", value: req.session.user_id}],
			 null, null, null, function(result, fields, err){
			 	if(err) throw err
			    else{
			        req.session.password = result[0].password
			        if(oldpass){
			        	var bytes  = CryptoJS.AES.decrypt(req.session.password, md5(oldpass));
			        	var deemail = bytes.toString(CryptoJS.enc.Utf8);
			        	if(deemail != req.session.email){
			        		res.json({result: 110001})
			        		req.session.password = null;
			        		delete req.session.password
			        	}else
			        		res.json({result: 110000})
			        }
			    }
			 })
		}else{
			if(oldpass){
				var bytes  = CryptoJS.AES.decrypt(req.session.password, md5(oldpass));
			    var deemail = bytes.toString(CryptoJS.enc.Utf8);
				if(deemail != req.session.email){
			        res.json({result: 110001})
			        req.session.password = null;
			        delete req.session.password
			    }else
			    	res.json({result: 110000})
			}
		}
	}
})


router.route('/user/addex')
.post(function(req, res){
	if(req.session.user_id){
		var lgid = parseInt(req.body.data.lgid)
		var deid = parseInt(req.body.data.deid)
		var time = req.body.data.time
		if(lgid && deid){
			var field = ["user_id", "degree_id", "language_id", "time", "prio"]
			var value = [req.session.user_id, deid, lgid, time, 0]
			querysimple.insertTable("exchangelg", field, value, function(result, err){
				if (err) {throw err}
				else
					res.json({res: 110000})
			} )
		}
	}
})


router.route('/user/addnat')
.post(function(req, res){
	if(req.session.user_id){
		var lgid = parseInt(req.body.data.lgid)
		var time = req.body.data.time
		if (lgid) {
			var field = ["user_id", "language_id", "time", "prio"]
			var value = [req.session.user_id, lgid, time, 0]
			querysimple.insertTable("nativelg", field, value, function(result, err){
				if (err) {throw err}
				else
					res.json({res: 110000})
			} )
		}
	}
})

router.route('/user/loaddegree')
.get(function(req, res){
	if(req.session.user_id){
		querysimple.selectTable("degree", ["id", "name"], null, null, null, null,
			function(result, field, err){
				if(err) throw err
				else
					res.json({result: result})
			})
	}
})

module.exports = router;