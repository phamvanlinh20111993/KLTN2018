var express = require('express')
var router = express.Router()
var passport = require('passport')
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var mysql = require('mysql');
var libfunc = require('../local_modules/customfunction')
var querysimple = require('../model/QuerysingletableSimple')

/* su dung bo loc de kiem tra nguoi dung trk khi dang nhap */
router.route('/user/filter')
.get(function(req, res){

	if(req.cookies.CeE7_z1ws || req.session.api){

		var emailuser = "";
		if(req.session.api)
			emailuser = req.session.email
		else{
			var bytes = CryptoJS.AES.decrypt(req.cookies.CeE7_z1ws, "20111993");
			emailuser = bytes.toString(CryptoJS.enc.Utf8);//chuỗi string
		}

		req.session.api = null
		delete req.session.api 

		querysimple.selectTable("blocklist_admin", ["blockwho"], 
			[{op:"", field: "blockwho", value: emailuser}], null, null, null, function(result, fields, err){
				if(err)  throw err;
				if(result.length > 0){
					if(req.session)
						req.session.destroy()
					res.redirect('/languageex/user/error?err='+encodeURIComponent(md5(62)))
				}else{
					//check nguoi dung da dang nhap chua
					querysimple.selectTable("User", ["state"], [{op:"", field: "email", value: emailuser}],
						null, null, null, function(result, fields, err){
						if (err) throw err;
						else{
							if(result.length > 0){
							//	if(result[0].state == 0){
									req.session.filter = true;
									res.redirect('/languageex/home')
							//	}else{
							//		res.redirect('/languageex/user/error?err='+encodeURIComponent(md5(8)))//ve trang dang nhap
							//	}
							}
						}

					})
				}
			})
    }else
    	res.redirect(307, '/languageex/user/login')
})
.post(function(req, res){
   var email = req.body.username
   var pass = req.body.password
  
    if(libfunc.validateEmail(email) && libfunc.validatePassword(pass))
    {
   		querysimple.selectTable("blocklist_admin", ["blockwho"],
   			[{op:"", field: "blockwho", value: email}], null, null, null, function(result, fields, err){
   			if(err)  throw err;
   			if(result.length > 0){
				res.redirect('/languageex/user/error?err='+encodeURIComponent(md5(62)))
			}else{
				//kiem tra tai khoan nay da duoc su dung hay chua
				querysimple.selectTable("user", ["state"], [{op:"", field: "email", value: email}],
					null, null, null, function(result, fields, err){
					if (err) throw err;
					else{
						if(result.length > 0){
						//	if(result[0].state == 0){
								req.session.filter = true;
								res.redirect(307, '/languageex/user/login')
						//	}else
						//	    res.redirect('/languageex/user/error?err='+encodeURIComponent(md5(8)))//ve trang dang nhap//dang nhap ve trang dang nhap
						}
					}
				})
			}
   		})
    }else
    	res.redirect(307, '/languageex/user/login')
})


module.exports = router;