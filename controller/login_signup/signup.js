var express = require('express')
var router = express.Router()
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy
var passport = require('passport')
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var mysql = require('mysql');
//var sendmail = require('../local_modules/lib/sendmail.js')
var sendEmail = require('../../local_modules/lib/sendmail1')
var libfunction = require('../../local_modules/customfunction')
var workfile = require('../../local_modules/workwithfile')
var fs = require('fs');
var path = require('path')
var querysimple = require('../../model/QuerysingletableSimple')


function existAccount(email, cb)
{
   querysimple.selectTable("User", ["email", "provider"], 
      [{ op:"", field: "email", value: email}], null, null, null, 
     function(result, fields, error)
     {
         if(error)   throw error
         else{
            if(result.length > 0)
               cb(result, true)
            else
               cb(null, false)
         }
     })
}


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//using facebook to login
//webpage https://developers.facebook.com/apps/1717831324956209/dashboard/
passport.use(new FacebookStrategy({
    clientID: '1717831324956209',
    clientSecret: '9ca3effed1f323a2ef976f0a2c6af145',
    callbackURL: "/languageex/user/signup/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
   //update code
   if (profile) {
		user = profile;
		return done(null, user);//se tra ve thong tin nguoi dung o router
	}else {
		return done(null, false);
	}	
  }
));

router.route('/user/signup/api')
.get(function(req, res)
{	
	var key = req.query.key
	if(key == "facebook")
		res.redirect('/languageex/user/signup/api/auth/facebook')
	else if(key=="google")
	  res.redirect('/languageex/user/signup/api/auth/google')
		
})
.post(function(req, res)
{  

   if(libfunction.validateEmail(req.body.email) && libfunction.validateName(req.body.name) 
      && libfunction.validatePassword(req.body.password))
   {
      //checkdatabase
      existAccount(req.body.email, function(data, result){
         if(result)
            res.render('ejs/Signup', {err: "Email address already exists."})
         else{
            req.session.user_id = libfunction.makeUserid()//make random useid
            req.session.email = req.body.email
            req.session.username = req.body.name//authenticate user
            req.session.password = req.body.password//save password
            req.session.provider = "custom"

            req.session.authenticatemail = libfunction.makeEmailid()//create session for another page
   
            var aumail = CryptoJS.AES.encrypt(req.session.user_id, (req.session.authenticatemail).toString());
            var url = "user/signup/authenticate?key="+req.session.provider + "&user=" + aumail;
            //sendmail.sendmailAuthenticate(req.session.email, makemailid(), url)

            sendEmail(req.session.email, req.session.authenticatemail, url, 0, function(err, data){
               if(err)  console.log(err);
               else     console.log(data);
            })
            res.redirect(307, '/languageex/user/signup/verify')
         }
      })
         
   }

})



router.route('/user/signup/api/auth/facebook').get(
	passport.authenticate('facebook', { scope : ['email', 'pages_messaging_phone_number', 'read_page_mailboxes'] }))

router.route('/user/signup/api/auth/facebook/callback')
.get(passport.authenticate('facebook', { failureRedirect: '/user/error?err=' +encodeURIComponent(md5(2)) }),
  function(req, res) {
      //check database set user login berofe..
      existAccount(req.user.emails[0].value, function(data, result){

         if(result){
            if(data[0].provider != "facebook")
               res.redirect('/languageex/user/error?err='+encodeURIComponent(md5(5)))  
            else{
               req.session.api = true;
               req.session.user_id = req.user.id//authenticate user
               req.session.email = req.user.emails[0].value//authenticate user
               res.redirect('/languageex/home');
            }
         }else{
            req.session.user_id = req.user.id//authenticate user
            req.session.email = req.user.emails[0].value//authenticate user
            req.session.username = req.user.displayName//authenticate user
            req.session.provider = req.user.provider
            req.session.photo = req.user.photos[0].value
            req.session.gender = req.user.gender

         //    console.log(req.user)
            var value = encodeURIComponent(req.session.provider);
            var id = encodeURIComponent(CryptoJS.AES.encrypt(req.user.id.toString(), md5(req.session.username)));
            res.redirect(307,'/languageex/user/signup/register?key=' + value + '&id=' + id);
         }
      })
      
})



//page https://console.developers.google.com/apis/credentials?project=gold-obelisk-185422
//using google account to login
passport.use(new GoogleStrategy({
    clientID: '163229107634-ve1vh1vknim98odu2kp6duujh0jfesqf.apps.googleusercontent.com',
    clientSecret: 'eJTV7yQB1cT_fxurc3qD723M',
    callbackURL: "http://localhost:5050/languageex/user/signup/api/auth/google/callback"
 //   callbackURL: "https://app-chat-phamlinh.herokuapp.com/user/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    if (profile) {
		user = profile;
		return done(null, user);
	}else {
		return done(null, false);
	}	
  }
));



router.route('/user/signup/api/auth/google').get(passport.authenticate('google',
   { scope: ['email', 'profile'] }), function(req, res){
    // The request will be redirected to Google for authentication, so
    // this function will not be called.
     res.redirect('/user/signup');
  });

router.route('/user/signup/api/auth/google/callback').get( 
  passport.authenticate('google', { failureRedirect: '/user/error?err=' +encodeURIComponent(md5(3))}),
  function(req, res) {
    // Successful authentication, redirect home
  
   existAccount(req.user.emails[0].value, function(data, result){
      if(result){
         if(data[0].provider != "google")
            res.redirect('/languageex/user/error?err='+encodeURIComponent(md5(6)))  
         else{
            req.session.api = true;
            if(req.user.id > 18446744073709552000)
               req.user.id = req.user.id/100
            
            req.session.user_id = parseInt(req.user.id)//authenticate user
            req.session.email = req.user.emails[0].value//authenticate user
            res.redirect('/languageex/home');
         }
      }
      else{
       //  console.log(req.user)
         if(req.user.id > 18446744073709552000)
            req.user.id = req.user.id/100

         req.session.user_id = parseInt(req.user.id)  //authenticate user
         req.session.email = req.user.emails[0].value
         req.session.username = req.user.displayName  //authenticate user
         req.session.photo = req.user.photos[0].value
         req.session.gender = req.user.gender
         req.session.provider = req.user.provider

         var value = encodeURIComponent(req.session.provider);
         var id = encodeURIComponent(CryptoJS.AES.encrypt(req.user.id.toString(), md5(req.session.username)));
          console.log("fsdfdsf" + id)
         //307 in post router then redirect to url type post(not get)
         res.redirect(307, '/languageex/user/signup/register?key=' + value + '&id=' + id);//get redirect
      }
   })
      
  });


//verify user
router.route('/user/signup/verify')
.post(function(req, res){
   if(req.session.authenticatemail)//exist session for this page
      res.render('ejs/authenticateUser')
   else
      res.redirect('/languageex/user/signup')
})


module.exports = router;