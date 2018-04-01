var getListUserCommnunity = function(id, callback) {
	// body...
	$.ajax({
        type: "POST",
        url: "/languageex/home/community",
        data:{id: id},
        error: function(xhr, status, error){
          callback(null, error)
        },
        success: function(data)
        {
            if(typeof callback == "function"){
                callback(JSON.parse(data), null);//tra ve du lieu
            }
        }
    })
}

//theo doi hoac bo theo doi nguoi dung
var ajaxRequest = function(url, data, callback) {//data is a object
  // body...
  $.ajax({
        type: "POST",
        url: url,
        data:{data: JSON.stringify(data)},
        error: function(xhr, status, error){
          callback(null, error)
        },
        success: function(data)
        {
            if(typeof callback == "function"){
                callback(data, null);//tra ve du lieu
            }
        }
    })
}

var showUserCommunity = function(User)
{
	var isOnline = '<h4> <i class="fa fa-circle" style="color:red;"></i> '+User.infor.name+' </h4>'

	var isFollow = "color:#3399FF;"

	if(User.infor.state == 1){//dang online
		isOnline = '<h4> <i class="fa fa-circle" style="color:green;"></i> '+
               User.infor.name+' </h4>'
	}  

	if(User.infor.follow.id > 0){
		isFollow = "color:red;"
	}


	var Interface = '<div id = "'+User.infor.id+'_community" class="col-md-3" style="min-height: 360px;margin-top: 3%;margin-left: 2%;">'+
             			'<div class="card inf-content">' +
               				'<div style="width: 100%;height: 50%;" data-toggle="tooltip" title="View profile ">' +
                  				'<img src="'+User.infor.photo+'"alt="'+User.infor.name+'" style="width:100%;max-height:100%;cursor:pointer; '+
            					     'border-radius:8px;border:1px solid #696969; " onclick = "viewProfileByImage(\''+User.infor.id+'\')">'+
              				'</div>'+
         					'<div style="line-height: 90%;">'+
       							isOnline +
        						'<p class="title">Leanrning: '+User.infor.exlanguage[0].laname+'</p>'+
         						'<p class="title">Degree: '+User.infor.exlanguage[0].dename+'</p>'+
        						'<p class="title">Level: '+User.infor.level+'</p>'+
        						'<p>Age: '+(new Date().getYear() - new Date(User.infor.dateofbirth).getYear())+'</p>'+
        					'</div>'+
               				'<div style="margin: 24px 0;">'+
                  				'<a href="#" onclick="register_popup(event,'+User.infor.id+',\''+User.infor.name+'\''+", "+'\''+User.infor.photo+'\');" '+
                            ' data-toggle="tooltip" title="Send message" class="icon">'+
                  				'<i class="fa fa-comment" style="font-size:36px;color:#3399FF;"></i></a>' +

                  				'<a href="#"  onclick="followUser('+User.infor.id+',\''+User.infor.name+'\')" data-toggle="tooltip" title="Follow or Unfollow '+User.infor.name+
                          '"class="icon"><i class="fa fa-eye" id="'+User.infor.id+'_follow" style="font-size:36px;'+isFollow+'"></i></a>'

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

//tu dong hoi ham nay
getListUserCommnunity(MYID, function(data, err)
{
  // console.log(data)
  if(err) alert(err)
  else{
    var size = data.community.length;
    var ind = 0;
  //  console.log(data)
    for(ind = 0; ind < size; ind++)
    	showUserCommunity(data.community[ind])
  }
})


function viewProfileByImage(uid){
  location.href = "/languageex/user/profile?uid="+encodeURIComponent(uid)
}


var selectUserCommunity = function(){
  document.getElementById("MycommunityExchange").innerHTML = ""
  getListUserCommnunity(MYID, function(data, err){
    if(err) alert(err)
    else{
      var size = data.community.length;
      var ind = 0;
      //  console.log(data)
      for(ind = 0; ind < size; ind++)
        showUserCommunity(data.community[ind])
    }
  })
}


var showMyNotify = function(){
  $('#showNotifyHome').modal({backdrop: 'static', keyboard: false})  
  //dosomething 

}

$('#showNotifyHome').on('hidden.bs.modal', function () {
  $('#autoclicknot').removeClass();
  $('#autoclickcom').addClass('active');
})

//theo doi nguoi dung
var followUser = function(uid, name)
{
  var idfollow = document.getElementById(uid+"_follow")

  if(idfollow.style.color == "red"){//da theo doi, bay gio bo theo doi
    var data = {id: uid, follow: false} 
      ajaxRequest('/languageex/home/unfollow', data, function(data, err){
         if(err) alert(err)
         else{ 
          idfollow.style.color = "#3399FF"
          alert("You unfollowed "+ name)
        }
    })
  }else{
    var data = {id: uid, follow: true, time: new Date()} 
    ajaxRequest('/languageex/home/follow', data, function(data, err){
        if(err) alert(err)
        else{
         idfollow.style.color = "red"
          alert("You followed "+ name)
       }
    })
    
  }
}


