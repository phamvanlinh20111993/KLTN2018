var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var postcomment = require('../../model/post_comments_query')
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')

/**
	get date time to insert sql
**/
function getDateTime(date){
    return date.getFullYear() +
     '-' + (date.getMonth() + 1) +
     '-' + (date.getDate()) +
     ' ' + (date.getHours()) +
     ':' + (date.getMinutes()) +
     ':' + (date.getSeconds());
}

router.route('/user/createPost')
.post(function(req, res){

	if(req.session.user_id){
		var field = ["user_id", "content", "title_id", "turnof_cmt" , "ctime"]
		var resobj = req.body.data
		var value = [req.session.user_id, resobj.content, resobj.title, 0, getDateTime(new Date(resobj.time))]
		querysimple.insertTable("post", field, value, function(result, fields, err){
			if(err) throw err
			else{
				postcomment.selectMaxIdTable("post", function(data){
					res.json({resp: parseInt(data)})
				})
			}
		})
	}
})


router.route('/user/createcmt')
.post(function(req, res){

	if(req.session.user_id){
		var rqdata = req.body.data
		var field = ["post_id", "user_id", "content", "ctime"]
		var value = [rqdata.id, rqdata.uid, rqdata.content, getDateTime(new Date(rqdata.time))]
		postcomment.selectMaxIdTable("comment", function(data){
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
		console.log(req.body.data)

		var postid = req.body.data.pid
		var ncontent = req.body.data.content
		var time = req.body.data.time

		if(postid && ncontent && time && req.session.user_id == req.body.data.uid)
		{
			var field = ["content", "isedit"]
			querysimple.updateTable("post", [{field: "content", value: ncontent}, 
			 {field: "isedit", value: 1}], 
			 [{op:"", field: "id", value: postid}], 
			 function(result, err){
				if(err) throw err
				else
					res.json({response: result.affectedRows})
			 })
		}
	}
})


router.route('/user/editCmt')
.put(function(req, res){
	if(req.session.user_id){
		console.log("ưtf")
		var content = req.body.data.content
		var time = req.body.data.time
		var cmtid = req.body.data.id
		if(cmtid && time && content)
		{
			var field = ["content","isedit"]
			querysimple.updateTable("comment", [{field: "content", value: content}, 
			 {field: "isedit", value: 1}], 
			 [{op:"", field: "id", value: cmtid}], 
			 function(result, err){
				if(err) throw err
				else
					res.json({response: result.affectedRows})
			 })
		}
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
							var time = getDateTime(new Date(req.body.data.time))
						//	console.log("time la " + time)
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

//delete post
router.route('/user/delpost')
.delete(function(req, res){
	if(req.session.user_id)
	{
		var post_id = req.body.data.pid
	//	console.log("post id la " + post_id)
		if(post_id){
			querysimple.deleteTable("post", [{op: "", field: "id", value: post_id}], 
			 function(result, err){
				if(err) throw err
			    else res.json({response: result.affectedRows})
			})
		}
	}
})

//delete comment
router.route('/user/delcmt')
.delete(function(req, res){
	if(req.session.user_id)
	{
		var cmt_id = req.body.data.id
		var user_id = req.body.data.uid
		if(cmt_id && user_id){
			querysimple.deleteTable("comment", [{op: "", field: "user_id", value: user_id},
			  {op: "AND", field: "id", value: cmt_id}], function(result, err){
				if(err) throw err
			    else res.json({response: result.affectedRows})
			})
		}

	}
})

//get report content to user
router.route('/user/loadrppost')
.get(function(req, res){
	if(req.session.user_id){
		querysimple.selectTable("report_post_comment_content", ["id", "code", "content"],
			null, null, null, null, function(result, fields, err){
			if(err) throw err
			else{
			 	res.json({data: result})
			}
		})
	}
})

//receive report of user
router.route('/user/reportpost')
.post(function(req, res){
	if(req.session.user_id){

	}
})


module.exports = router;