var express = require('express')
var app = express()
var router = express.Router()
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy
var passport = require('passport')
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass

router.route('/user/signup/authentication')
.post(function(req, res){
	
})


module.exports = router;