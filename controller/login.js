var express = require('express')
var router = express.Router()
var CryptoJS = require("crypto-js")
var sendEmail = require('../local_modules/lib/sendmail1')
var md5 = require('md5') 
var libfunction = require('../local_modules/customfunction')


router.route('/user/login')
 .post(function(req, res)
{	
	var pass = req.body.password
	var email = req.body.username // email
	var rememberme = req.body.rememberMe
	var Infor = {
		error: "Not valid account", 
		notify: "Forgot password",
		link: "/languageex/user/login/resetpassword"
	}

	if(libfunction.validateEmail(email) && libfunction.validatePassword(pass)){
		//check database...., validate this do not trust user

		req.session.resetpass = email;
		req.session.count_rspass = true;//tao 1 session de gui mail 1 lan duy nhat khi nguoi dung quen mat khau 
		res.render('ejs/Login', {infor: Infor, state: 1, email: email})
	}else
		res.render('ejs/Login', {infor: Infor, state: 1})

})
 .put(function(req, res)
{	
	res.render('ejs/Login', {})
})
 .delete(function(req, res)
{	
	res.render('ejs/Login', {})
})


 router.route('/user/login/resetpassword')
 .get(function(req, res)
 {
 	if(typeof req.session.resetpass != 'undefined'){
 		var Content = {
 			code: 0,//forgot password
 			title: "Forgot password",
 			value: "You can reset your password here",
 			email: req.session.resetpass
 		}

 		req.session.resetpass = null;
 		delete req.session.resetpass
 		res.render('ejs/forgotpass',{content: Content})
 	}

 	var uid = req.query.id
 	if(typeof uid != 'undefined' && typeof req.session.verifyemail != 'undefined'){
 		if(md5(req.session.verifyemail) == uid){
 			var Content = {
 				code: 1,//change password
 				title: "Change password",
 				value: "You must change your password here",
 				email: ""
 			}
 			res.render('ejs/forgotpass',{content: Content})
 		}else
 			res.redirect('/languageex/user/login')

 		req.session.verifyemail = null;
 		delete req.session.verifyemail
 	}
 	
 })
 .post(function(req, res){

 	var useremail = req.body.email
 	if(libfunction.validateEmail(useremail)){
 		//check email exists in database
 		//..........

 		req.session.verifyemail = libfunction.makeEmailid()
 		var url = "user/login/resetpassword?id=" + md5(req.session.verifyemail)
 		req.session.useremail = useremail
 		if(req.session.count_rspass == true)
 		{
 			sendEmail(useremail, req.session.verifyemail, url, 1, function(err, data){
      			if(err)  console.log(err);
      			else     console.log(data);
   			})
   			req.session.count_rspass = false;
 		}

 		var Content = {
 			code: 2,//change password with form input 
 			title: "Change password",
 			value: "You must change your password here",
 			email: ""
 		}

 		res.render('ejs/forgotpass',{content: Content})
 	}
 })

 router.route('/user/login/changepass')
 .post(function(req, res){

 	//check account
 	var emailcode = req.body.capcha
 	var newpass = req.body.newpassword
 	if(req.session.verifyemail && libfunction.validatePassword(newpass) 
 		&& libfunction.validateEmailId(emailcode)){

 		if(emailcode == req.session.verifyemail){
 			//insert database...

 			res.redirect('/languageex/home')
 		}else{
 			var errid = encodeURIComponent(md5(req.session.verifyemail));
 			res.redirect('languageex/user?errid=' + errid)
 		}

 		req.session.verifyemail = null
 		req.session.count_rspass = null
 		delete req.session.count_rspass
 		delete req.session.verifyemail

 	}else
 		res.redirect('/languageex/user/error')
 })

module.exports = router;