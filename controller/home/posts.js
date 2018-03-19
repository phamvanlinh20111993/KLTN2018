var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var postcomment = require('../../model/post_comments')

router.route('/user/signup/api/register')
.get(function(req, res){
	
	
})
.post(function(req, res){
	
})

module.exports = router;

/*
simple-peer
peerjs
socket.io p2p
*/