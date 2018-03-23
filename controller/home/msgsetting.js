var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')



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
					console.log(result)
					res.send(JSON.stringify({report: result}))
				}
			})
	}
})



router.route('/user/changetrasprio')
.put(function(req, res){

	if(req.session.filter){
		console.log(req.body)//update database
		res.send(JSON.stringify({notify: "Done"}))
	}
})


router.route('/user/changemissprio')
.put(function(req, res){

	if(req.session.filter){
		console.log(req.body)//update database
		res.send(JSON.stringify({notify: "Done"}))
	}
})


router.route('/user/report')
.post(function(req, res){

	if(req.session.filter){
		console.log(req.body)//update database
		res.send(JSON.stringify({notify: "Done"}))
	}
})


router.route('/user/delconversation')
.delete(function(req, res){

	if(req.session.filter){
		console.log(req.body)
	}
})


router.route('/user/checkmiss')
.post(function(req, res){

	if(req.session.filter){
		console.log(req.body)
	}
})


router.route('/user/blockmsg')
.post(function(req, res){

	if(req.session.filter){
		console.log(req.body)
	}
})


module.exports = router;