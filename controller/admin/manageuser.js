var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var queryadmin = require('../../model/Adminquery')
var libfunction = require('../../local_modules/customfunction')


function existAccount(email, cb)
{
   querysimple.selectTable("user", ["email", "provider"], 
      [{ op:"", field: "email", value: email}], null, null, null, 
     function(result, fields, error)
     {
         if(error)   throw error;
         else{
            if(result.length > 0)
               cb(result, true)
            else
               cb(null, false)
         }
     })
}

router.route('/admin/home/manage/user')
.get(function(req, res){

	if(req.session.user_id){
		var loaduser = req.query.loaduser
		if(!loaduser)
			res.render('ejs/admin/pages/tables.ejs')
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

	if(req.session.user_id){
		 var languageEx = req.body.languageexchange//check database
	    var date =  new Date(req.body.bday)
	    var gender = req.body.gender//check value
	    var native = req.body.selectnative//check database
	    var degree = req.body.selectlevel//check database
	    var describe = req.body.describeuser//check character
	    var email = req.body.email
	    var password1 = req.body.password
	    var name = req.body.name
	    var id = libfunction.makeUserid()//make random useid
	    var photo = "/img/user.png"
	    var provider = "admin"
	    console.log(req.body)

       //kiem tra tai khoan nay ton tai chưa
       existAccount(email, function(re, boolean){
       	if(!boolean){
		      password = CryptoJS.AES.encrypt(email, md5(password1)).toString()
		      var field = ["id", "email", "password", "name", "level_id", "des","score", "photo", "gender", "dateofbirth", "creatime", "provider"]
		      var value = [parseInt(id), email, password, name, 1, describe, 0, photo, gender, date, 
		      		new Date(), provider]
		      querysimple.insertTable("user", field, value, function(result, err){
		         if(err)
		            throw err;
		         else{
		            querysimple.insertTable("exchangelg", ["user_id", "degree_id", "language_id", "time", "prio"], 
		               [parseInt(id), parseInt(degree), parseInt(languageEx), new Date(), 1], function(result, err){
		               if(err)
		                  throw err;
		               else{
		                  querysimple.insertTable("nativelg", ["user_id", "language_id", "time", "prio"], 
		                     [parseInt(id), parseInt(native), new Date(), 1], function(result, err){
		                     if(err)
		                        throw err;
		                     else
		                       res.render('ejs/admin/pages/tables.ejs', {err: "Da them thanh cong tai khoan " + email +"."});
		                  })
		               }
		            })
		         } 
		      })
		   }else
		   	 res.render('ejs/admin/pages/tables.ejs', {err: "Da ton tai tai khoan."}); 
	   })
	}
})

.put(function(req, res){
	if(req.session.user_id){
		
	}
})

.delete(function(req, res){
	if(req.session.user_id){
		var user_id = req.body.data.id
		var reason = "Vi phạm nghiêm trọng các điều khoản, chính sách trong dịch vụ."
		var type = req.body.data.type
		var time = new Date()

		if(parseInt(user_id) > 1000000000 && type){
			if(type == "block"){
				reason = req.body.data.reason
				time = new Date(req.body.data.time)
			}else if(type="delete"){
				time = new Date(new Date().setFullYear(new Date().getFullYear()+100))
			}

			querysimple.insertTable("blocklist_admin", ["blockwho", "timeblock", "content", "time"], 
			   [parseInt(user_id), time, reason, new Date()], function(result, err){
			   if(err)
			      throw err;
			   else
			      res.json({result: "Done"});
			})
		}
	}
})


router.route('/admin/loadlg')
.get(function(req, res){
	if(req.session.user_id){
		querysimple.selectTable("language", ["id", "name"], null, 
            [{field: "name", op: "ASC"}], null, null, function(result, fields, err){
               if(err) throw err
               var Language = result

               querysimple.selectTable("degree", ["id", "name"], null, 
                  null, null, null, function(re, fields, err){
                  if(err) throw err
                  var Degree = re
                  res.json({Lang: Language, De: Degree})
               })
         })
	}
})


router.route('/admin/home/unlock')
.delete(function(req, res){
	if(req.session.user_id){
		var user_id = req.body.data.id
		querysimple.deleteTable("blocklist_admin", [{op: "", field:"blockwho", value: user_id}], 
			function(result, err){
            if(err) throw err
            else res.json({result: "Done"});
      })
	}
})




module.exports = router;