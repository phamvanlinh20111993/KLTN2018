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
	if(req.session.user_id){
		querysimple.selectListUserMessenger(req.session.user_id, function(data, err){
			if(err) throw err;
			else{
			//	console.log(data)
				res.send(JSON.stringify({listuser: data}))
			}
		})
	}
})
.post(function(req, res)
{
	if(req.session.filter)
	{
		querysimple.selectListUserMessenger(req.session.user_id, function(data, err){
			if(err) throw err;
			else{
		//		console.log(data)
				res.send(JSON.stringify({listuser: data}))
			}
		})
		
	}else
		res.redirect('/languageex/user/login', {state: 1})
})

router.route('/user/loasdspecuser')
.post(function(req, res)
{
	var pid = parseInt(req.body.data.pid)
	if(req.session.filter && pid)
	{
		querysimple.selectSpecificUserMessenger(req.session.user_id, pid, function(data, err){
			if(err) throw err;
			else{
				res.send(JSON.stringify({listuser: data}))
			}
		})
		
	}
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
		var myex = req.body.myex
		
		if(messid){
			var ismisspelling = 0;

			translate(content, {to: myex}).then(resp => {
            	console.log(resp);
            	console.log(resp.text);
            	console.log(resp.from.text.autoCorrected);
            	console.log(resp.from.text.value);
            	console.log(resp.from.text.didYouMean);

            	if(resp.from.text.value == "")//ok tin nhan khong có lỗi dịch
            		ismisspelling = 0;
            	else{
                	if(resp.from.language.iso == resp.from.language.iso)//loi chinh ta
                		ismisspelling = 1;
                	else ismisspelling = 2;///khong phai ngon ngu dang trao doi
                }

            	anotherquery.editMessage(messid, whoedit, content, ismisspelling, function(data, err){
					if(err) throw err
					else{
						if(data.length > 0){
							console.log(data)
						}
						res.send(JSON.stringify({content:content}))
					} 
			    })
            	
        	}).catch(err => {
         		console.error(err);
         		ismisspelling = 3; //loi dich tin nhan

         		anotherquery.editMessage(messid, whoedit, content, ismisspelling, function(data, err){
					if(err) throw err
					else{
						if(data.length > 0){
							console.log(data)
						}
						res.send(JSON.stringify({content:content}))
					} 
			    })
         	   
      		});

		}else
			res.send(JSON.stringify({content:null}))
	}
})


router.route('/user/translate')
.post(function(req, res){

	if(req.session.user_id){
		var myex = req.body.ex
		var mynat = req.body.nat
		//console.log(myex + "   " + mynat )
		var content = req.body.content
		var Trlcontent = {}

		translate(content, {from: myex, to: mynat}).then(resp => {
            Trlcontent.translated = resp.text
            Trlcontent.error = null
            Trlcontent.from = resp.from.language.iso
            Trlcontent.mean = resp.from.language.didYouMean //gợi ý một sự sửa đổi trong ngôn ngữ nguồn
            Trlcontent.didYouMean = resp.from.text.didYouMean //đúng nếu API đã đề nghị chỉnh sửa văn bản
            Trlcontent.autoCorrected = resp.from.text.autoCorrected // true nếu API tự động sửa văn bản

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

//phat hien ngon ngu va dich
router.route('/user/transbymatch')
.post(function(req, res){

	if(req.session.user_id){
		var mynat = req.body.data.nat
		//console.log(myex + "   " + mynat )
		var content = req.body.data.content
		var Trlcontent = {}

		translate(content, {to: mynat}).then(resp => {
            Trlcontent.translated = resp.text
            Trlcontent.error = null
            Trlcontent.from = resp.from.language.iso//ngon ngu phat hien duoc
            Trlcontent.mean = resp.from.language.didYouMean //gợi ý một sự sửa đổi trong ngôn ngữ nguồn
            Trlcontent.didYouMean = resp.from.text.didYouMean //đúng nếu API đã đề nghị chỉnh sửa văn bản
            Trlcontent.autoCorrected = resp.from.text.autoCorrected // true nếu API tự động sửa văn bản
            Trlcontent.successChange = resp.from.text.value

            console.log(resp);
            console.log(resp.text);
            console.log(resp.from.text.autoCorrected);
            console.log(resp.from.text.value);
            console.log(resp.from.text.didYouMean);

            querysimple.selectTable("language", ["name"], [{op:"", field: "symbol", value: Trlcontent.from}],
            	null, null, null, function(result, field, err){
            		if(err) throw err
            		else{
            			if(result.length > 0)
                        	Trlcontent.from = result[0].name
                        else 
                        	Trlcontent.from += "(symbol)"
            			res.send(JSON.stringify({content:Trlcontent}))
            	    }
            	})

           

        }).catch(err => {
         	console.error(err);
         
         	Trlcontent.translated = null
         	Trlcontent.error = err

         	res.send(JSON.stringify({content:Trlcontent}))
      });
	}
	
})


//check loi chinh ta
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
            Misscontent.text = resp.text
            Misscontent.error = null

            res.send(JSON.stringify({content:Misscontent}))
        }).catch(err => {
         	console.error(err);
            Misscontent.error = err
            Misscontent.value = null
         	
         	res.send(JSON.stringify({content:Misscontent}))
      });
	}
})


module.exports = router;