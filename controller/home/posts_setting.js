var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var postcomment = require('../../model/post_comments_query')
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')




router.route('/user/createPost')
.post(function(req, res){

	if(req.session.user_id){
		var field = ["user_id", "content", "title_id", "turnof_cmt" , "ctime"]
		var resobj = req.body.data
		var value = [req.session.user_id, resobj.content, resobj.title, 0, resobj.time]
		
		querysimple.insertTable("post", field, value, function(result, fields, err){
			if(err) throw err
			else
				res.json({resp: "Success."})
		})
	}
})


router.route('/user/createCmt')
.post(function(req, res){

	if(req.session.user_id){
		var rqdata = req.body.data
		var field = ["post_id", "user_id", "content", "ctime"]
		var value = []
		
		querysimple.insertTable("comment", field, value, function(result, fields, err){
			if(err) throw err
			else
				res.json({res: "Success."})
		})
	}
})



router.route('/user/editPost')
.put(function(req, res){

	if(req.session.user_id){

	}
})


router.route('/user/editCmt')
.put(function(req, res){

	if(req.session.user_id){

	}
})



module.exports = router;