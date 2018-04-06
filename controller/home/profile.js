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



module.exports = router;