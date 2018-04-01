var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')
const translate = require('google-translate-api');


router.route('/user/messages')
.get(function(req, res){
	//khoi tao session
	if(req.session.user_id){

		var uid = req.query.uid
		if(typeof uid != 'undefined'){
			querysimple.selectMessage(req.session.user_id, uid, function(err, data){
				if(err) throw err;
				else {
					console.log("Start send messages....")
					res.send(JSON.stringify({listmessage: data}))
				}
			})
		}	
	}
})
.post(function(req, res)
{
	if(req.session.filter)
	{
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


router.route('/user/loasdusermsg')
.get(function(req, res){
	//khoi tao session
	var uid = req.body.uid



})
.post(function(req, res)
{
	if(req.session.filter)
	{
		querysimple.selectListUserMessenger(req.session.user_id, function(data, err){
			if(err) throw err;
			else
				console.log(data)
			res.send(JSON.stringify({listuser: data}))
		})
		
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



router.route('/user/editmsg')
.post(function(req, res)
{
	if(req.session.user_id){
		var content = req.body.content
		var messid = req.body.id
		var whoedit = req.session.user_id

		console.log(req.body.id)

		anotherquery.editMessage(messid, whoedit, content, function(data, err){
			if(err) throw err
			else{
				if(data.length > 0){
					console.log(data)
				}
				res.send(JSON.stringify({content:content}))
			} 
		})
	}
})


router.route('/user/translate')
.post(function(req, res){

	if(req.session.user_id){
		var myex = req.body.ex
		var mynat = req.body.nat
		var content = req.body.content
		var Trlcontent = {}

		translate(content, {from: myex, to: mynat}).then(resp => {
            Trlcontent.translated = resp.text
            Trlcontent.error = null

            console.log(resp);
            console.log(resp.text);

            res.send(JSON.stringify({content:Trlcontent}))
        }).catch(err => {
         	console.error(err);
         
         	Trlcontent.translated = null
         	Trlcontent.error = err

         	res.send(JSON.stringify({content:Trlcontent}))
      });
	}
	
})


router.route('/user/checkmisspelling')
.post(function(req, res){

	if(req.session.user_id){

		var myex = req.body.ex
		var content = req.body.content
		var Misscontent = {}

		translate(content, {to: myex}).then(resp => {

			console.log(resp);
            console.log(resp.text);
            console.log(resp.from.text.autoCorrected);
            console.log(resp.from.text.value);
            console.log(resp.from.text.didYouMean);

            Misscontent.checktrue = resp.from.text.autoCorrected
            Misscontent.corrected = resp.from.text.didYouMean,
            Misscontent.language = resp.from.language.iso,
            Misscontent.value = resp.from.text.value
            Misscontent.error = null

            res.send(JSON.stringify({content:Misscontent}))
        }).catch(err => {
         	console.error(err);
            Misscontent.error =  err
            Misscontent.value = null
         	
         	res.send(JSON.stringify({content:Misscontent}))
      });
	}
})


module.exports = router;