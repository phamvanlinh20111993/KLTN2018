var express = require('express')
var app = express()
var router = express.Router()
var state = -1;
var md5 = require('md5') // su dung md5 ma hoa pass

router.route('/user')
 .get(function(req, res)
{	
	var errid = req.query.errid;
	if(typeof errid != 'undefined'){	
		state = 2;
		res.render('ejs/login', {state: state})
	}else
		res.render('ejs/Login')
})

 router.route('/user/login')
 .get(function(req, res)
{	
	state = 1;
	res.render('ejs/Login', { state: state })
})

router.route('/user/signup')
 .get(function(req, res)
{	
	res.render('ejs/Signup')
})

 router.route('/user/error')
 .get(function(req, res)
{	
	res.render('ejs/Error')
})
 .post(function(req, res)
{	
	res.render('ejs/Error')
})

 router.route('/user/logout')
 .get(function(req, res)
{	
	req.session.destroy()
	res.redirect('/languageex/user')
})
 .post(function(req, res)
{	
	req.session.destroy()
	res.redirect('/languageex/user')
})

 router.route('/')
 .get(function(req, res)
{	
	res.redirect('/languageex/user')
})
 .post(function(req, res)
{	
	res.redirect('/languageex/user')
})

 //profile
 router.route('/user/profile')
 .get(function(res, req)
 {
 	var userid = req.query.uid
 	if(userid && req.session){
 		//check database, escape sql injection..
 		
 	}else
 		res.render('html/Notfound.html')
 })

module.exports = router;