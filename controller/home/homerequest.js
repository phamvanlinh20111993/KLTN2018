var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')

function APIComunity(id, cb)
{
	querysimple.selectUserCommunityNative(id, function(result, err){
	    if(err) throw err;
	 	else{
	 		var res = result
			var ind = 0, ind1, mark = [];
			var ListUser = []

			for(ind = 0; ind < res.length; ind++) mark[ind] = 0;

			for(ind = 0; ind < res.length-1; ind++)
			{
				ListUser[ind] = {}
				ListUser[ind].infor = {}
				ListUser[ind].infor.id = res[ind].id
				ListUser[ind].infor.email = res[ind].email
				ListUser[ind].infor.name = res[ind].uname
				ListUser[ind].infor.describe = res[ind].des
				ListUser[ind].infor.photo = res[ind].photo
				ListUser[ind].infor.gender = res[ind].gender
				ListUser[ind].infor.score = res[ind].score
				ListUser[ind].infor.level = res[ind].level
				ListUser[ind].infor.state = res[ind].state // 1 is on, 0 is off

				ListUser[ind].infor.exlanguage = []
				ListUser[ind].infor.exlanguage[0] = {}
				ListUser[ind].infor.exlanguage[0].laname = res[ind].lname
				ListUser[ind].infor.exlanguage[0].dename = res[ind].dename

				var index = 1;
				for(ind1 = ind+1; ind1 < res.length; ind1++){
					if(res[ind].id == res[ind1].id && mark[ind1] == 0){
						mark[ind1] = 1;
						ListUser[ind].infor.exlanguage[index] = {}
						ListUser[ind].infor.exlanguage[index].laname = res[ind].lname
						ListUser[ind].infor.exlanguage[index].dename = res[ind].dename
						index++;
					}
				}
		    }
		    
		    cb(ListUser)
	 	}
	 }) 

}

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

							res.render('ejs/homepage', {user: result})
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
				req.session.user_id = result[0].id
				req.session.email = result[0].email
				req.session.password = result[0].password	
				res.render('ejs/homepage', {user: result})
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
			console.log(result.affectedRows + " record(s) updated")
		})

		querysimple.selectUser(req.session.email, function(result, fields, err){
			if(err) throw err
			res.render('ejs/homepage', {user: result})
		})
		
	}else if(!req.session.filter){
		res.redirect('/languageex/user/filter')
	}else
		res.redirect('/languageex/user/login')
})

module.exports = router;