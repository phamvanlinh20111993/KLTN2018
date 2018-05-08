var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') 
var libfunction = require('../../local_modules/customfunction')
var querysimple = require('../../model/QuerysingletableSimple')


///https://accounts.google.com/DisplayUnlockCaptcha.
//neu gap loi khong the dung nodemailer de dăng nhap vao tai khoan gmail
router.route('/admin/pages/')
.get(function(req, res){

	
})


 module.exports = router;