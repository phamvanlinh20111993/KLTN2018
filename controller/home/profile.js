var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')
var anotherquery = require('../../model/Anotherquery')


router.route('/user/updateinfo')
.post(function(req, res){

	if(req.session.filter){
		
	}
})

router.route('/user/myfollowers')
.post(function(req, res){

	if(req.session.filter){
		
	}
})


router.route('/user/myblacklists')
.post(function(req, res){

	if(req.session.filter){
		
	}
})



module.exports = router;