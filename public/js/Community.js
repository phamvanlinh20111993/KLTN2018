var getListUserCommnunity = function(id, callback) {
	// body...
	$.ajax({
        type: "POST",
        url: "/languageex/home/community",
        data:{id: id},
        success: function(data)
        {
            if(typeof callback == "function"){
                callback(JSON.parse(data));//tra ve du lieu
            }
        }
    })
}

var showUserCommunity = function(User)
{
	var isOnline = '<h4> <i class="fa fa-circle" style="color:red;"></i> '+User.infor.name+' </h4>'
	var isFollow = '<a href="#"  data-toggle="tooltip" title="Follow '+User.infor.name+'"  class="icon"><i class="fa fa-eye" style="font-size:36px;color:#3399FF;"></i></a>'

	if(User.infor.state == 1){
		isOnline = '<h4> <i class="fa fa-circle" style="color:green;"></i> '+User.infor.name+' </h4>'
	}

	if(User.infor.follow.id > 1){
		isFollow = '<a href="#"  data-toggle="tooltip" title="Unfollow '+User.infor.name+'"  class="icon"><i class="fa fa-eye" style="font-size:36px;color:red;"></i></a>'
	}


	var Interface = '<div class="col-md-3" style="min-height: 360px;margin-top: 3%;margin-left: 2%;">'+
             			'<div class="card inf-content">' +
               				'<div style="width: 100%;height: 50%;" data-toggle="tooltip" title="View profile ">' +
                  				'<a href="/languageex/user/profile?uid='+User.infor.id+'"><img src="'+User.infor.photo+'"'+
            					'alt="'+User.infor.name+'" style="width:100%;max-height: 100%;border-radius:8px;border:1px solid #696969; ">'+
            					'</a>'+
              				'</div>'+
         					'<div style="line-height: 90%;">'+
       							isOnline +
        						'<p class="title">Leanrning: '+User.infor.exlanguage[0].laname+'</p>'+
         						'<p class="title">Degree: '+User.infor.exlanguage[0].dename+'</p>'+
        						'<p class="title">Level: '+User.infor.level+'</p>'+
        						'<p>Age: '+(new Date().getYear() - new Date(User.infor.dateofbirth).getYear())+'</p>'+
        					'</div>'+
               				'<div style="margin: 24px 0;">'+
                  				'<a href="#" onclick="register_popup('+User.infor.id+',\''+User.infor.name+'\');"  data-toggle="tooltip" title="Send message" class="icon">'+
                  				'<i class="fa fa-comment" style="font-size:36px;color:#3399FF;"></i></a>' +
                  				isFollow +
               				'</div>'+
            			'</div>'+
          			'</div>'

    document.getElementById("MycommunityExchange").innerHTML += Interface
}


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

getListUserCommnunity(myid, function(data){
	console.log(data)
    var size = Object.size(data.community);
    var ind = 0;
    for(ind = 0; ind < size; ind++){
    	showUserCommunity(data.community[ind])
    }
})