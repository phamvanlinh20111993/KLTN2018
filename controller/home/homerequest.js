var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')


router.route('/home')
.get(function(req, res)
{
	var User  = {}
	if(!req.session.user_id)//khong ton tai phien lam viec
	{
		if(req.session.filter && req.cookies.CeE7_z1ws){
			var bytes  = CryptoJS.AES.decrypt(req.cookies.CeE7_z1ws, "20111993");
			var bytes1 = CryptoJS.AES.decrypt(req.cookies.Coie_ccd4, "20111993");
			var emailuser = bytes.toString(CryptoJS.enc.Utf8);//chuỗi string
			var passuser = bytes1.toString(CryptoJS.enc.Utf8);

			querysimple.selectTable("User", ["password", "stay"], [{op:"", field: "email", value: emailuser}],
				null, null, null, function(result, field, err)
				{
					if(err) throw err

					var bytes  = CryptoJS.AES.decrypt(result[0].password, md5(passuser));
					var deemail = bytes.toString(CryptoJS.enc.Utf8);

					if(deemail.toString() == emailuser.toString() && result[0].stay == 1){//chua logout bao gio
						querysimple.selectUser(emailuser, function(result, fields, err){
							if(err) throw err
							req.session.user_id = result[0].id
							req.session.email = result[0].email
							req.session.password = result[0].password
							req.session.photo = result[0].photo
							anotherquery.select_max_prio_Ex_and_Navtive(result[0].id, function(data){
								req.session.mynative = data[0].natsy
								req.session.myexchange = data[0].exsy
								res.render('ejs/homepage', {user: result})
							})
						})
					}else
						res.redirect('/languageex/user/login')
			})
		}else
			res.redirect('/languageex/user/login')

	}else{ //ton tai phien lam viec
		if(req.session.filter){
			querysimple.updateTable("User", [{field: "state", value: 1}, {field: "stay", value: 1}], 
				[{op:"", field: "id", value: parseInt(req.session.user_id)}], function(result, err){
				if(err) throw err;
				console.log(result.affectedRows + " record(s) updated")
			})

			querysimple.selectUser(req.session.email, function(result, fields, err){
				if(err) throw err
				else{
					req.session.user_id = result[0].id
					req.session.email = result[0].email
					req.session.password = result[0].password	
					req.session.photo = result[0].photo
				
					anotherquery.select_max_prio_Ex_and_Navtive(result[0].id, function(data){
						req.session.mynative = data[0].natsy
						req.session.myexchange = data[0].exsy
						res.render('ejs/homepage', {user: result})
					})
				}
			})
		}else
			res.redirect('/languageex/user/filter')
	}

})
.post(function(req, res)
{
	var User  = {}

	if(req.session.user_id && req.session.filter){
    	
    	querysimple.updateTable("User", [{field: "state", value: 1}, {field: "stay", value: 1}], 
			[{op:"", field: "id", value: parseInt(req.session.user_id)}], function(result, err){
			if(err) throw err;
			anotherquery.select_max_prio_Ex_and_Navtive(result[0].id, function(data){
				req.session.mynative = data[0].natsy
				req.session.myexchange = data[0].exsy
				res.render('ejs/homepage', {user: result})
			})
			console.log(result.affectedRows + " record(s) updated")
		})

		querysimple.selectUser(req.session.email, function(result, fields, err){
			if(err) throw err
			else{
				anotherquery.select_max_prio_Ex_and_Navtive(result[0].id, function(data){
					req.session.mynative = data[0].natsy
					req.session.myexchange = data[0].exsy
					res.render('ejs/homepage', {user: result})
				})
				res.render('ejs/homepage', {user: result})
			}
		})
		
	}else if(!req.session.filter){
		res.redirect('/languageex/user/filter')
	}else
		res.redirect('/languageex/user/login')
})


//tinh diem cho nguoi dung
router.route('/user/score')
.post(function(req, res){
	if(req.session.user_id){
		var Score = req.body.data.score//tao 1 session luu tru diem cua nguoi dung
		console.log("User's score: " + Score)
		if(Score){
			anotherquery.calculateScore(req.session.user_id, Score, function(data){
				if(data)
					res.json({result: "successed."})
				else 
					res.json({result: "error"})
			})
		}
	}
})

module.exports = router;