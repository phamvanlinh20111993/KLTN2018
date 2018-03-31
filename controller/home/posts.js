var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var postcomment = require('../../model/post_comments')
var querysimple = require('../../model/QuerysingletableSimple')

router.route('/user/post')
.get(function(req, res){
	if(req.session.user_id){

		res.render('ejs/discussion', {user: user})
	}
	
})
.post(function(req, res){
	
})

module.exports = router;

/*
simple-peer
peerjs
socket.io p2p
*/