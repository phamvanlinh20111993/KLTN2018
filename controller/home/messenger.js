var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')


router.route('/user/messages')
.get(function(req, res){

})
.post(function(req, res)
{
	if(req.session.user_id){
		var idanother = req.body.anotherid    	                   	
		if(typeof idanother != 'undefined'){
			querysimple.selectMessage(req.session.user_id, idanother, function(err, data){
				if(err) throw err;
				else {
					console.log("Start send messages....")
					res.send(JSON.stringify({listmessage: data}))
				}
			})
		}
		
	}else
		res.redirect('/languageex/user/login', {state: 1})
})



router.route('/user/loadmsgsetting')
.get(function(req, res){

})
.post(function(req, res)
{
	if(req.session.user_id){
		var idanother = req.body.anotherid  

		if(typeof idanother != 'undefined'){
			querysimple.loadMessageSetting(req.session.user_id, 
				idanother,function(data){
				console.log(data)
				res.send(JSON.stringify({settingmsg: data}))
			})
		}
	}
})



router.route('/user/editmgs')
.get(function(req, res){

})
.post(function(req, res)
{
	if(req.session.user_id){
		
	}
})

module.exports = router;