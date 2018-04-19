var express = require('express')
var router = express.Router()
var CryptoJS = require("crypto-js")
var sendEmail = require('../../local_modules/lib/sendmail1')
var md5 = require('md5') 
var libfunction = require('../../local_modules/customfunction')
var querysimple = require('../../model/QuerysingletableSimple')
var CryptoJS = require("crypto-js")


function existAccount(email, cb)
{
   querysimple.selectTable("User", ["id", "email"], 
      [{ op:"", field: "email", value: email }], null, null, null, 
     function(result, fields, error)
     {
         if (error)   throw error
         if(result.length > 0)
            cb(result, true)
         else
            cb(null, false)
     })
}


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

	if(libfunction.validateEmail(email) && libfunction.validatePassword(pass) 
		&& req.session.filter)
	{
		//check database...., validate this do not trust user
		querysimple.selectTable("User", ["id", "email", "password", "provider"], 
			[{op:"", field: "email", value: email}], null, null, null,
			function(result, fields, err){
				if(err)	throw err;

				if(result.length > 0 && result[0].provider == "custom"){//co ton tai tai khoan
					var bytes  = CryptoJS.AES.decrypt(result[0].password, md5(pass));
					var deemail = bytes.toString(CryptoJS.enc.Utf8);

					if(deemail.toString() == email.toString())
					{
						req.session.email = result[0].email
						req.session.user_id = result[0].id
						if(typeof rememberme != 'undefined'){
							//mã hóa cookie đảm bảo an toàn
							var emailofuser = CryptoJS.AES.encrypt(email, "20111993").toString();
							var passofuser = CryptoJS.AES.encrypt(pass, "20111993").toString();
							res.cookie('CeE7_z1ws', emailofuser, { maxAge: 3600*48*1000, httpOnly: true })//2 ngay
							res.cookie('Coie_ccd4', passofuser, { maxAge: 3600*48*1000, httpOnly: true })		
						}	
						res.redirect('/languageex/home')
					}else{
						req.session.resetpass = email;
						req.session.count_rspass = true; 
						res.render('ejs/Login', {infor: Infor, state: 1, email: email})
					}

				}else{
					Infor.error = "This account does not existed.";
					Infor.notify = "Signup now ??"
					Infor.link = "/languageex/user/signup"
					req.session.signupemail = email
					res.render('ejs/Login', {infor: Infor, state: 1, email: email})
				}
		   })

	}else{
		req.session.resetpass = email;
		req.session.count_rspass = true;
		res.render('ejs/Login', {infor: Infor, state: 1})
	}

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

 			req.session.automailcode = req.session.verifyemail;
 			req.session.verifyemail = null
			delete req.session.verifyemail
 			res.render('ejs/forgotpass',{content: Content})
 		}else{
 			req.session.verifyemail = null
			delete req.session.verifyemail
 			res.redirect('/languageex/user/login')
 		}
 	}
 	
 })
 .post(function(req, res){

 	var useremail = req.body.email
 	if(libfunction.validateEmail(useremail)){
 		//check email exists in database
 		existAccount(useremail, function(data, result){
 			if(result){
 				req.session.verifyemail = libfunction.makeEmailid()
 				var url = "user/login/resetpassword?id=" + md5(req.session.verifyemail)
 				req.session.email = useremail
 				req.session.user_id = data[0].id
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
 			}else
 				res.redirect('/languageex/user/login')
 		})
 	}
 })


 router.route('/user/login/changepass')
 .post(function(req, res){

 	//check account
 	var emailcode = req.body.capcha
 	var newpass = req.body.newpassword

 	if((req.session.verifyemail && libfunction.validatePassword(newpass) 
 		&& libfunction.validateEmailId(emailcode)) || req.session.automailcode){

 		if(emailcode == req.session.verifyemail || req.session.automailcode){
 			//update database...
 			var password = CryptoJS.AES.encrypt(req.session.email, md5(newpass)).toString()
 			req.session.verifyemail = null
 			req.session.count_rspass = null
 			delete req.session.count_rspass
 			delete req.session.verifyemail

 			if(req.session.automailcode){
 				req.session.automailcode = null
 				delete req.session.automailcode
 			}

 			querysimple.updateTable("User", [{field: "password", value: password}], 
 				[{op: "", field: "id", value: parseInt(req.session.user_id)},
 				 {op: "AND", field: "email", value: req.session.email}], function(result, error){
 					if(error){
 						throw error
 					}
 					else{
 						console.log(result.affectedRows + " record(s) updated");
 						res.redirect('/languageex/home')
 					}
 				})
 			
 		}else{
 			req.session.verifyemail = null
 			req.session.count_rspass = null
 			delete req.session.count_rspass
 			delete req.session.verifyemail

 			var errid = encodeURIComponent(md5(req.session.verifyemail));
 			res.redirect('languageex/user?errid=' + errid)
 		}

 	}else
 		res.redirect('/languageex/user/error?err=' + encodeURIComponent(md5(5)))
 })

module.exports = router;