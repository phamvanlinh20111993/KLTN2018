var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass

router.route('/user/signup/api/register')
.get(function(req, res){
	//save to database then redirect

	res.redirect('/languageex/home')
	
})
.post(function(req, res){
	console.log(req.session)
	req.session.destroy()
	res.redirect('/languageex/home')
})

module.exports = router;

/*
simple-peer
peerjs
socket.io p2p
*/