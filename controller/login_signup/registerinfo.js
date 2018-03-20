var express = require('express')
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var multipart  = require('connect-multiparty')//upload file dung connect-multiparty
var multipartMiddleware = multipart()
var querysimple = require('../../model/QuerysingletableSimple')
var libfunction = require('../../local_modules/customfunction')


router.route('/user/signup/register')
.get(function(req, res){
  
   if(req.session.username && req.query.id)
   {
      var bytes = CryptoJS.AES.decrypt((req.query.id).toString(), md5(req.session.username));
      var userid = bytes.toString(CryptoJS.enc.Utf8);
      //check hacker
      if(userid == req.session.user_id){
        var User_api = {
            photo: req.session.photo,
            name: req.session.username,
            gender: req.session.gender,
            provider: req.session.provider,
            key: CryptoJS.AES.encrypt((req.session.user_id + req.session.username), md5(req.session.user_id)).toString()
         }

         querysimple.selectTable("Language", ["id", "name"], null, 
            [{field: "name", op: "ASC"}], null, null, function(result, fields, err){
               if(err) throw err
               var Language = result

               querysimple.selectTable("Degree", ["id", "name"], null, 
                  null, null, null, function(re, fields, err){
                  if(err) throw err

                  var Degree = re
                  res.render('ejs/RegisterInformation', {User: User_api, Lang: Language, De: Degree})
               })
         })

      }else{
          errorcode = encodeURIComponent(md5(0))
          res.redirect('/languageex/user/error?err='+errorcode)
      }

   }else{
      res.redirect('/languageex/user')
   }
})
.post(multipartMiddleware, function(req, res)
{  
    var languageEx = req.body.languageexchange//check database
    var day = req.body.selectday
    var month = req.body.selectmonth
    var year = req.body.selectyear
    var gender = req.body.gender//check value
    var native = req.body.selectnative//check database
    var degree = req.body.selectlevel//check database
    var describe = req.body.describeuser//check character

    if(req.session.user_id && libfunction.validateDadeofBirth(day, month, year) 
      && libfunction.validateGender(gender)){

      var password = null;
      if(req.session.password)
         password = CryptoJS.AES.encrypt(req.session.email, md5(req.session.password)).toString()

      var date = new Date((year+ "-" + month+"-"+day).replace(/-/g,"/"))

      var field = ["id", "email", "password", "name", "level_id", "des","score", "photo", "gender", "dateofbirth", "creatime", "provider"]

      var value = [parseInt(req.session.user_id), req.session.email, password, 
      req.session.username, 1, describe, 0, req.session.photo, gender, date, new Date(), req.session.provider]

      querysimple.insertTable("User", field, value, function(result, err){
         if(err)
            throw err;
         else{
            querysimple.insertTable("ExchangeLG", ["user_id", "degree_id", "language_id", "time", "prio"], 
               [parseInt(req.session.user_id), parseInt(degree), parseInt(languageEx), new Date(), 1], function(result, err){
               if(err)
                  throw err;
               else{
                  querysimple.insertTable("nativelg", ["user_id", "language_id", "time", "prio"], 
                     [parseInt(req.session.user_id), parseInt(native), new Date(), 1], function(result, err){
                     if(err)
                        throw err;
                     else {
                        req.session.filter = true;
                        res.redirect('/languageex/home');
                     }
                  })
               }
            })
         } 
      })
         
    }
})


module.exports = router;

/*
simple-peer
peerjs
socket.io p2p
*/