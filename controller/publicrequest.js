var express = require('express')
var app = express()
var router = express.Router()
var state = -1;

router.route('/user')
 .get(function(req, res)
{	
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

module.exports = router;