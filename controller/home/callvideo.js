var express = require('express')
var app = express()
var router = express.Router()

router.route('/user/callvideo')
.get(function(req, res){
	//res.render('ejs/callvideo.html')
	res.render('ejs/callvideo.ejs')
})

module.exports = router;