var express = require('express')
var app = express()
var router = express.Router()
var CryptoJS = require("crypto-js")
var md5 = require('md5') // su dung md5 ma hoa pass
var querysimple = require('../../model/QuerysingletableSimple')


/**
searchcondi is param for user seach users by name, or email
**/
function APIComunityEx(id, searchcondi, cb)
{
	querysimple.selectUserCommunityEx(id, searchcondi, function(result, err){
	    if(err) throw err;
	 	else{
	 		var res = result
			var ind = 0, ind1, mark = [];
			var ListUser = []

			for(ind = 0; ind < res.length; ind++) mark[ind] = 0;

			for(ind = 0; ind < res.length; ind++)
			{
				ListUser[ind] = {}
				ListUser[ind].infor = {}
				ListUser[ind].infor.id = res[ind].id
				ListUser[ind].infor.email = res[ind].email
				ListUser[ind].infor.name = res[ind].uname
				ListUser[ind].infor.describe = res[ind].des
				ListUser[ind].infor.photo = res[ind].photo
				ListUser[ind].infor.gender = res[ind].gender
				ListUser[ind].infor.score = res[ind].score
				ListUser[ind].infor.level = res[ind].level
				ListUser[ind].infor.state = res[ind].state // 1 is on, 0 is off
				ListUser[ind].infor.dateofbirth = res[ind].dateofbirth

				ListUser[ind].infor.iswasblocked = {
					state: false,//danh sach nguoi dung da block message voi toi
					timeblock: res[ind].timeblock
				}
				if(res[ind].whoblock)
					ListUser[ind].infor.iswasblocked.state = true
				
				ListUser[ind].infor.exlanguage = []
				ListUser[ind].infor.exlanguage[0] = {}
				ListUser[ind].infor.exlanguage[0].laname = res[ind].lname
				ListUser[ind].infor.exlanguage[0].dename = res[ind].dename

				ListUser[ind].infor.follow = {}
				ListUser[ind].infor.follow.id = -1;
				ListUser[ind].infor.follow.tracked = -1;
				ListUser[ind].infor.follow.time = -1;

				var index = 1;
				for(ind1 = ind+1; ind1 < res.length; ind1++){
					if(res[ind].id == res[ind1].id && mark[ind1] == 0){
						mark[ind1] = 1;
						ListUser[ind].infor.exlanguage[index] = {}
						ListUser[ind].infor.exlanguage[index].laname = res[ind].lname
						ListUser[ind].infor.exlanguage[index].dename = res[ind].dename
						index++;
					}
				}
		    }

		    //check followers of this user
		    querysimple.selectTable("follow", ["id","tracked", "ctime"], [{op: "", 
		    	field: "followers", value: id }], 
		    	null, null, null, function(result, fields, err){
		    		if(err) throw err
		    		else{
		    			if(result.length > 0){
		    				var ind = 0, index = 0;
		    				for(ind = 0; ind < result.length; ind++){
		    					for(index = 0; index < ListUser.length; index++){
		    						if(result[ind].tracked == ListUser[index].infor.id){
		    							ListUser[index].infor.follow.id = result[ind].id;
		    							ListUser[index].infor.follow.tracked =  result[ind].tracked;
										ListUser[index].infor.follow.time = result[ind].ctime;
		    						}
		    					}
		    				}
		    			}

		    			cb(ListUser)
		    		}
		    })
	 	}
	 }) 

}


function APIComunityNative(id, cb)
{
	querysimple.selectUserCommunityNative(id, function(result, err){
	    if(err) throw err;
	 	else{
	 		var res = result
			var ind = 0, ind1, mark = [];
			var ListUser = []

			for(ind = 0; ind < res.length; ind++) mark[ind] = 0;

			for(ind = 0; ind < res.length; ind++)
			{
				ListUser[ind] = {}
				ListUser[ind].infor = {}
				ListUser[ind].infor.id = res[ind].id
				ListUser[ind].infor.email = res[ind].email
				ListUser[ind].infor.name = res[ind].uname
				ListUser[ind].infor.describe = res[ind].des
				ListUser[ind].infor.photo = res[ind].photo
				ListUser[ind].infor.gender = res[ind].gender
				ListUser[ind].infor.score = res[ind].score
				ListUser[ind].infor.level = res[ind].level
				ListUser[ind].infor.state = res[ind].state // 1 is on, 0 is off
				ListUser[ind].infor.dateofbirth = res[ind].dateofbirth

				ListUser[ind].infor.iswasblocked = {
					state: false,//danh sach nguoi dung da block message voi toi
					timeblock: res[ind].timeblock
				}
				if(res[ind].whoblock)
					ListUser[ind].infor.iswasblocked.state = true

				ListUser[ind].infor.nativelg = []
				ListUser[ind].infor.nativelg[0] = {}
				ListUser[ind].infor.nativelg[0].laname = res[ind].lname
				ListUser[ind].infor.nativelg[0].dename = res[ind].dename

				ListUser[ind].infor.follow = {}
				ListUser[ind].infor.follow.id = -1;
				ListUser[ind].infor.follow.tracked = -1;
				ListUser[ind].infor.follow.time = -1;

				var index = 1;
				for(ind1 = ind+1; ind1 < res.length; ind1++){
					if(res[ind].id == res[ind1].id && mark[ind1] == 0){
						mark[ind1] = 1;
						ListUser[ind].infor.nativelg[index] = {}
						ListUser[ind].infor.nativelg[index].laname = res[ind].lname
						ListUser[ind].infor.nativelg[index].dename = res[ind].dename
						index++;
					}
				}
		    }

		    //check followers of this user
		    querysimple.selectTable("follow", ["id","tracked", "ctime"], [{op: "", 
		    	field: "followers", value: id }], 
		    	null, null, null, function(result1, fields, err1){
		    	if(err1) throw err1
		    	else{
		    		if(result1.length > 0){
		    			var ind = 0, index = 0;
		    			for(ind = 0; ind < result1.length; ind++){
		    				for(index = 0; index < ListUser.length; index++){
		    					if(result1[ind].tracked == ListUser[index].infor.id)
		    					{
		    						ListUser[index].infor.follow.id = result1[ind].id;
		    						ListUser[index].infor.follow.tracked = result1[ind].tracked;
									ListUser[index].infor.follow.time = result1[ind].ctime;
		    					}
		    				}
		    			}
		    		}

		    		cb(ListUser)
		    	}
		    })
	 	}
	 }) 

}


router.route('/home/community')
.get(function(req, res){

})
.post(function(req, res)
{
	var iduser = req.body.id 
	if(req.session.user_id){
		if(iduser && parseInt(iduser) == parseInt(req.session.user_id)){
			APIComunityEx(req.session.user_id, null, function(data){
				res.send(JSON.stringify({community: data}))
			})
		}
	}
})


//theo doi nguoi dung
router.route('/home/follow')
.post(function(req, res)
{
	if(req.session.user_id){
		
		var data = JSON.parse(req.body.data)
		
		querysimple.selectTable("follow", ["id"], 
		 [{op:"", field: "followers", value: req.session.user_id}, 
			  {op:"AND", field: "tracked", value: data.id}], 
		null, null, null, function(result, fields, err){
			if(err) throw err;
			else{
				if(result.length == 0){
					var field = ["followers", "tracked", "ctime"]
					var value = [req.session.user_id, data.id, data.time]
					querysimple.insertTable("follow", field, value, function(result, err){
						
						if(err) throw err
						else  res.json({data: result.affectedRows})
					})
				}else
					res.json({data: "Some error here."})
			}
		})
	}
})


//bo theo doi nguoi dung
router.route('/home/unfollow')
.post(function(req, res)
{
	if(req.session.user_id){
		console.log(data)
		var data = JSON.parse(req.body.data)
		console.log(data)
		console.log("id " + data.id)
		querysimple.selectTable("follow", ["id"], 
		 [{op:"", field: "followers", value: req.session.user_id}, 
			  {op:"AND", field: "tracked", value: data.id}], 
		null, null, null, function(result, fields, err){
			if(err) throw err;
			else{
				console.log(result)
				console.log("length " + result)
				if(result.length > 0){
					var whecdt = [{op: "", field: "followers", value: req.session.user_id}, 
					{op: "AND", field: "tracked", value: data.id}]
					querysimple.deleteTable("follow", whecdt, function(result, err){
						if(err) throw err
						else res.json({data: result.affectedRows})
					})
				}else 
					res.json({data: "Some error here."})
			}
		})
	}
})


router.route('/home/search')
.post(function(req, res){
	if(req.session.user_id){
		var searchvalue = req.body.data.value
		APIComunityEx(req.session.user_id, searchvalue, function(data){
			console.log(data)
			res.send(JSON.stringify({community: data}))
		})
	}
})


module.exports = router;