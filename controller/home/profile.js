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



module.exports = router;