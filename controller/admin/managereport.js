var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var queryadmin = require('../../model/Adminquery')
var libfunction = require('../../local_modules/customfunction')


router.route('/admin/home/manage/reportp')
.get(function(req, res){

	if(req.session.user_id){
		var loadrpp = req.query.type
		if(!loadrpp)
			res.render('ejs/admin/pages/forms.ejs')
		else{
			queryadmin.selectReportPost(req.session.user_id, function(result, err){
				if(err) throw err
				else{
				//	console.log(result)
					res.json({reportp: result})
				}
			})
		}
	}else
		res.redirect('/languageex/admin/login')
})
.post(function(req, res){

})
.put(function(req, res){
	
})
.delete(function(req, res){
	
})

router.route('/admin/home/manage/reportpro')
.get(function(req, res){

	if(req.session.user_id){
		var loadrpro = req.query.type
		if(!loadrpro)
			res.render('ejs/admin/pages/morris.ejs')
		else{
			queryadmin.selectUser(req.session.user_id, function(result, err){
				if(err) throw err
				else{
				//	console.log(result)
					res.json({user: result})
				}
			})
		}
	}else
		res.redirect('/languageex/admin/login')
})
.post(function(req, res){

})
.put(function(req, res){
	
})
.delete(function(req, res){
	
})


router.route('/admin/home/manage/reportmsg')
.get(function(req, res){

	if(req.session.user_id){
		var loadrpmsg = req.query.type
		if(!loadrpmsg)
			res.render('ejs/admin/pages/grid.ejs')
		else{
			queryadmin.selectUser(req.session.user_id, function(result, err){
				if(err) throw err
				else{
				//	console.log(result)
					res.json({user: result})
				}
			})
		}
	}else
		res.redirect('/languageex/admin/login')
})
.post(function(req, res){

})
.put(function(req, res){
	
})
.delete(function(req, res){
	
})


module.exports = router;