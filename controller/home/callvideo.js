var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')

router.route('/user/callvideo')
.get(function(req, res){
	res.render('ejs/callvideo.ejs')
})

module.exports = router;