var express = require('express')
var app = express()
var router = express.Router()

router.route('/user/callvideo')
.get(function(req, res){
	//res.render('ejs/callvideo.html')
	if(req.session.user_id)
		res.render('ejs/callvideo.ejs')
})

module.exports = router;