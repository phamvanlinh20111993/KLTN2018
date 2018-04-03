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


router.route('/user/createcmt')
.post(function(req, res){

	if(req.session.user_id){
		var rqdata = req.body.data
		var field = ["post_id", "user_id", "content", "ctime"]
		var value = [rqdata.id, rqdata.uid, rqdata.content, rqdata.time]
		postcomment.selectMaxIdCmt(function(data){
			querysimple.insertTable("comment", field, value, function(result, fields, err){
				if(err) throw err
				else{
					var idcmt = parseInt(data) + 1
					res.json({res: idcmt})
				}
			})
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


router.route('/user/likepost')
.post(function(req, res){

	if(req.session.user_id){
		var postid = req.body.data.id
		if(postid){
			querysimple.selectTable("likes_post", ["id"], [{op: "", field: "id_user", value: req.session.user_id},
				{op: "AND", field: "id_post", value: postid}], null, null, null, function(result, fields, err){
					if(err) throw err
					else{
						//chua co du lieu
						if(result.length == 0){
							var time = req.body.data.time
							var field = ["id_user", "id_post", "ctime"]
							var value = [req.session.user_id, postid, time]
							querysimple.insertTable("likes_post", field, value, function(result, err){
								if(err) throw err
								else res.json({response: result.affectedRows})
							})
						}else
							res.json({response: "No data."})
					}
			})
		}
	}
})
.delete(function(req, res){

	if(req.session.user_id){
		var postid = req.body.data.id
		if(postid){
			querysimple.selectTable("likes_post", ["id"], [{op: "", field: "id_user", value: req.session.user_id},
				{op: "AND", field: "id_post", value: postid}], null, null, null, function(result, fields, err){
					if(err) throw err
					else{
						//chua co du lieu
						if(result.length > 0){
							querysimple.deleteTable("likes_post", [{op: "", field: "id_user", value: req.session.user_id},
							  {op: "AND", field: "id_post", value: postid}], function(result, err){
							  	if(err) throw err
							  	else res.json({response: result.affectedRows})
							})
						}else
							res.json({response: "No data."})
					}
			})
		}
	}
})

//delete comment
router.route('/user/delcmt')
.delete(function(req, res){
	if(req.session.user_id)
	{
		var post_id = req.body.pid
		var user_id = req.body.uid
		if(post_id && user_id){
			querysimple.deleteTable("comment", [{op: "", field: "user_id", value: user_id},
			  {op: "AND", field: "post_id", value: post_id}], function(result, err){
				if(err) throw err
			    else res.json({response: result.affectedRows})
			})
		}

	}
})

//get infomation users likepost


module.exports = router;