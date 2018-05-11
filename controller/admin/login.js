var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') 
var libfunction = require('../../local_modules/customfunction')
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')

router.route('/admin')
.get(function(req, res){
	res.redirect('/languageex/admin/login')
})

router.route('/admin/login')
.get(function(req, res){

	if(req.cookies.CeE7_z1ws)
	{
		var bytes  = CryptoJS.AES.decrypt(req.cookies.CeE7_z1ws, "20111993");
		var bytes1 = CryptoJS.AES.decrypt(req.cookies.Coie_ccd4, "20111993");
		var emailuser = bytes.toString(CryptoJS.enc.Utf8);//chuỗi string
		var passuser = bytes1.toString(CryptoJS.enc.Utf8);

		querysimple.selectTable("user", ["id", "password", "stay", "admin"], [{op:"", field: "email", value: emailuser}],
			null, null, null, function(result, field, err)
		{
			if(err) throw err
			else{
				if(result[0].admin > 0 && result){
					var bytes  = CryptoJS.AES.decrypt(result[0].password, md5(passuser));
					var deemail = bytes.toString(CryptoJS.enc.Utf8);
					if(deemail.toString() == emailuser.toString() && result[0].stay == 1){//chua logout bao gio
						req.session.user_id = result[0].id
						req.session.admin = true
						req.session.email = deemail
						res.redirect('/languageex/admin/home')
					}else
						res.render('ejs/admin/Login', {email: emailuser, pass:passuser })
				}else
					res.redirect('/languageex/user')
			}
		})
	}else
		res.render('ejs/admin/Login')
})
 .post(function(req, res)
{	
	var pass = req.body.password
	var email = req.body.username // email
	var rememberme = req.body.rememberMe
	if(libfunction.validateEmail(email) && libfunction.validatePassword(pass))
	{
		//check database...., validate this do not trust user
		querysimple.selectTable("user", ["id", "email", "password", "admin"], 
			[{op:"", field: "email", value: email}], null, null, null,
			function(result, fields, err){
				if(err)	throw err;

				if(result.length > 0){//co ton tai tai khoan
					var bytes  = CryptoJS.AES.decrypt(result[0].password, md5(pass));
					var deemail = bytes.toString(CryptoJS.enc.Utf8);

					if(deemail.toString() == email.toString() && result[0].admin > 0)
					{
						req.session.email = result[0].email
						req.session.user_id = result[0].id
						req.session.admin = true
						if(typeof rememberme != 'undefined'){
							//mã hóa cookie đảm bảo an toàn
							var emailofuser = CryptoJS.AES.encrypt(email, "20111993").toString();
							var passofuser = CryptoJS.AES.encrypt(pass, "20111993").toString();
							res.cookie('CeE7_z1ws', emailofuser, { maxAge: 3600*48*1000, httpOnly: true })//2 ngay
							res.cookie('Coie_ccd4', passofuser, { maxAge: 3600*48*1000, httpOnly: true })		
						}	
						res.redirect('/languageex/admin/home')
					}else{ 
						res.render('ejs/admin/Login')
					}

				}else{
					res.render('ejs/admin/Login')
				}
		   })

	}else{
		res.render('ejs/admin/Login')
	}

})


 router.route('/admin/home')
.get(function(req, res)
{
	var User  = {}
	if(!req.session.user_id)//khong ton tai phien lam viec
	{
		if(req.cookies.CeE7_z1ws){
			var bytes  = CryptoJS.AES.decrypt(req.cookies.CeE7_z1ws, "20111993");
			var bytes1 = CryptoJS.AES.decrypt(req.cookies.Coie_ccd4, "20111993");
			var emailuser = bytes.toString(CryptoJS.enc.Utf8);//chuỗi string
			var passuser = bytes1.toString(CryptoJS.enc.Utf8);

			querysimple.selectTable("user", ["password", "stay", "admin"], [{op:"", field: "email", value: emailuser}],
				null, null, null, function(result, field, err)
				{
					if(err) throw err

					var bytes  = CryptoJS.AES.decrypt(result[0].password, md5(passuser));
					var deemail = bytes.toString(CryptoJS.enc.Utf8);

					if(deemail.toString() == emailuser.toString() && result[0].stay == 1 && result[0].admin > 0){//chua logout bao gio
						querysimple.selectUser(emailuser, function(result, fields, err){
							if(err) throw err
							req.session.user_id = result[0].id
							req.session.email = result[0].email
							req.session.photo = result[0].photo
							req.session.admin = true
							
							anotherquery.select_max_prio_Ex_and_Navtive(result[0].id, function(data){
								req.session.mynative = data[0].natsy//kí hieu tương ung voi ngon ngu
								req.session.myexchange = data[0].exsy
								req.session.mynativeid = data[0].natid//kí hieu ma ngon ngu
							    req.session.myexchangeid = data[0].exid
								res.render('ejs/admin/pages/index.ejs', {user: result})
							})
							
						})
					}else
						res.redirect('/languageex/admin/login')
			})
		}else{
			res.redirect('/languageex/admin/login')
		}

	}else{ //ton tai phien lam viec
		res.render('ejs/admin/pages/index.ejs')
	}

})
.post(function(req, res)
{
	var User  = {}

	if(req.session.user_id && req.session.filter){
    	querysimple.updateTable("user", [{field: "state", value: 1}, {field: "stay", value: 1}], 
			[{op:"", field: "id", value: parseInt(req.session.user_id)}], function(result, err){
			if(err) throw err;
			else{
				console.log(result.affectedRows + " record(s) updated")
			}
		})

		querysimple.selectUser(req.session.email, function(result, fields, err){
			if(err) throw err
			else{
				if(result[0].admin > 0){
						req.session.user_id = result[0].id
						req.session.email = result[0].email
						req.session.photo = result[0].photo
						req.session.admin = true
						anotherquery.select_max_prio_Ex_and_Navtive(result[0].id, function(data){
							req.session.mynative = data[0].natsy//kí hieu tương ung voi ngon ngu
							req.session.myexchange = data[0].exsy
							req.session.mynativeid = data[0].natid//kí hieu ma ngon ngu
							req.session.myexchangeid = data[0].exid
						    res.render('ejs/admin/pages/index.ejs', {user: result})
						})
					}else
						res.redirect('/languageex/admin/login')
			}
		})
		
	}else
		res.redirect('/languageex/admin/login')
})


 module.exports = router;