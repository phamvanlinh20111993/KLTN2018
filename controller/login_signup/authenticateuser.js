var express = require('express')
var app = express()
var router = express.Router()
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy
var passport = require('passport')
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass

//authenticate user
router.route('/user/signup/authenticate')
.get(function(req, res)
{

   if(typeof req.session.authenticatemail != 'undefined' 
      && typeof req.query.user != 'undefined')
   {

      var bytes = CryptoJS.AES.decrypt((req.query.user).toString(), (req.session.authenticatemail).toString());
      var decode = bytes.toString(CryptoJS.enc.Utf8);
      console.log(req.session.user_id + " ttt  " + decode)
      if((req.session.user_id).toString() == decode.toString()){
         var value = encodeURIComponent(req.session.provider);
         var id = encodeURIComponent(CryptoJS.AES.encrypt(req.session.user_id, md5(req.session.username)));
         res.redirect('/languageex/user/signup/register?key=' + value + '&id=' + id);
      }else{
         res.render('ejs/authenticateUser', 
            {err: 1, link: '/languageex/user/signup/'})
      }

   }else
      res.redirect('/languageex/user')

})
.post(function(req, res)
{
   if(req.session.authenticatemail){
       console.log(req.body.code123  + " ttt  " + req.session.authenticatemail)
      if((req.body.code123).toString() == (req.session.authenticatemail).toString()){
         var value = encodeURIComponent(req.session.provider);
         var id = encodeURIComponent(CryptoJS.AES.encrypt((req.session.user_id).toString(), md5(req.session.username)));
         req.session.authenticatemail = null;
         delete req.session.authenticatemail;
         res.redirect('/languageex/user/signup/register?key=' + value + '&id=' + id);
      }else{
         req.session.authenticatemail = null;
         delete req.session.authenticatemail;
         res.render('ejs/authenticateUser', 
            {err: 1, link: '/languageex/user/signup/'})
      }
   }

})


module.exports = router;