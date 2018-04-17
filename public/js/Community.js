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
        data:{ data: JSON.stringify(data) },
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

function formatAMPM(date)
{
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm +" "+ data.getDate() + "/" + (date.getMonth()+1)+
                date.getYear();

  return strTime;
}    

var showUserCommunity = function(User)
{
  
	var isOnline='<h4 ><i class="fa fa-circle" style="color:red;"></i><a href="#" style="text-decoration:none;color:black;" '+
            ' data-toggle="popover" title="Des" data-content="'+User.infor.describe+'"> '+User.infor.name+'</a> </h4>'

	var isFollow = "color:#3399FF;"
   var tooltipFollow = "Follow "
   var id = User.infor.id

   var isblockedmsg = '<a href="#" onclick="register_popup(event,'+id+',\''+User.infor.name+'\''+", "+'\''+User.infor.photo+'\');" '+
                            ' data-toggle="tooltip" title="Send message" class="icon">'+
                          '<i class="fa fa-comment" style="font-size:36px;color:#3399FF;"></i></a>'

	if(User.infor.state == 1){//dang online
		isOnline = '<h4> <i class="fa fa-circle" style="color:green;"></i> '+
               User.infor.name+' </h4>'
	}  

	if(User.infor.follow.id > 0){
		isFollow = "color:red;";
      tooltipFollow = "Unfollow ";
	}

   var followstr = '<a href="#" onclick="followUser('+id+',\''+User.infor.name+'\')" data-toggle="tooltip" title="'+tooltipFollow+User.infor.name+
                          '"class="icon"><i class="fa fa-eye" id="'+id+'_follow" style="font-size:36px;'+isFollow+'"></i></a>'

  if(User.infor.iswasblocked.state){
    isblockedmsg = '<a href="#" onclick="wasBlock('+id+',\''+User.infor.name+'\''+", "+'\''+User.infor.photo+'\',\''+User.infor.iswasblocked.timeblock+'\' );" '+
                            ' data-toggle="tooltip" title="Message blocked" class="icon">'+
                          '<i class="fa fa-comment" style="font-size:36px;color:black;"></i></a>'
  }

  if(User.youblocked){//trong truong hop tim kiem nguoi dung,se tim kiem ca nhung nguoi da block
    isblockedmsg = ""
    followstr = '<div class="alert alert-info"'+
         '<strong>Info!</strong> You blocked '+User.infor.name +
         ' At '+formatAMPM(new Date(User.youblocked.time))+
    '</div>'
  }

  if(User.youwasblocked){
    isblockedmsg = ""
    followstr = '<div class="alert alert-info"'+
         '<strong>Info!</strong> You was blocked by '+User.infor.name +
         ' At '+formatAMPM(new Date(User.youwasblocked.time))+
         ' with Reason: ' + User.youwasblocked.reason
    '</div>'
  }


	var Interface = '<div id = "'+id+'_community" class="col-md-3" style="min-height: 360px;margin-top: 3%;margin-left: 2%;">'+
             			'<div class="card inf-content">' +
               				'<div style="width: 100%;height: 50%;" data-toggle="tooltip" title="View profile ">' +
                  				'<img src="'+User.infor.photo+'" data="tooltip" title="'+User.infor.email+'" alt="'+User.infor.name+'" style="width:100%;max-height:100%;cursor:pointer; '+
            					     'border-radius:8px;border:1px solid #696969; " onclick="viewProfileByImage(\''+id+'\')">'+
              				'</div>'+
         					'<div style="line-height: 90%;">'+
       							isOnline +
        						'<p class="title">Leanrning: '+User.infor.exlanguage[0].laname+'</p>'+
         						'<p class="title">Degree: <span style="color:orange;">'+User.infor.exlanguage[0].dename+'</span></p>'+
        						'<p class="title">Level: '+User.infor.level+'</p>'+
        						'<p>Age: '+(new Date().getYear() - new Date(User.infor.dateofbirth).getYear())+'</p>'+
        					'</div>'+
               				'<div style="margin: 24px 0;">'+
                  				isblockedmsg +
                  				followstr+
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
   console.log(data)
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

//hien thi thong bao
var showMyNotify = function(){
  $('#showNotifyHome').modal({backdrop: 'static', keyboard: false})  
  //dosomething 
  var showNotifyHomeModal = document.getElementById("showNotifyHome")
  var showNotifyModal_Title = showNotifyHomeModal.getElementsByClassName("modal-title")[0]
  var showNotifyModal_Body = showNotifyHomeModal.getElementsByClassName("modal-body")[0]



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


//search users in commnunity

//search by click
var SearchUsersClick = function(id){
  var searchvalue = document.getElementById("searchuserex")
    if(searchvalue.value == ""){
      alert("Null value.")
    }else{
      var MycommunityExchange =  document.getElementById("MycommunityExchange")
      requestServer('/languageex/home/search', 'POST', {value: searchvalue.value}, 
        function(err, data){
          MycommunityExchange.innerHTML = ""
          if(data.community.length == 0){
            MycommunityExchange.innerHTML = "<div class='alert alert-danger' style='margin-top:10%;'>"+
               "<strong>Danger!</strong>No results match.</div>"+
               "<button type='button' class='btn btn-link' onclick='backToStart()'>Back to the start</button"
          }else{
            MycommunityExchange.innerHTML = "("+data.community.length+") Results match."
            for(ind = 0; ind <  data.community.length; ind++){
               showUserCommunity(data.community[ind])
            }
             MycommunityExchange.innerHTML  +=  "<button type='button' class='btn btn-link' onclick='backToStart()'>Back to the start</button"
         }
      })
    }
}

//search by press enter keyboard
var SearchUsersEnter = function(e, id){
  if(e.keyCode == 13){
    var searchvalue = document.getElementById("searchuserex")
    if(searchvalue.value == ""){
      alert("Null value.")
    }else{
      var MycommunityExchange =  document.getElementById("MycommunityExchange")
      requestServer('/languageex/home/search', 'POST', {value: searchvalue.value}, 
        function(err, data){
          MycommunityExchange.innerHTML = ""
          if(data.community.length == 0){
            MycommunityExchange.innerHTML = "<div class='alert alert-danger' style='margin-top:10%;'>"+
                     "<strong>Danger!</strong>No results match.</div>"+
                     "<button type='button' onclick='backToStart()' class='btn btn-link'>Back to the start</button"

          }else{
             MycommunityExchange.innerHTML = "("+data.community.length+") Results match."
            for(ind = 0; ind <  data.community.length; ind++){
               showUserCommunity(data.community[ind])
            }
            MycommunityExchange.innerHTML  +=  "<button type='button' class='btn btn-link' onclick='backToStart()'>Back to the start</button"
         }
      })
    }

  }
}

//quay lai man hinh bat dau cua commnunity
var backToStart = function(){
   getListUserCommnunity(MYID, function(data, err){
      if(err) alert(err)
      else{
         document.getElementById("MycommunityExchange").innerHTML = ""
         var size = data.community.length;
         var ind = 0;
            //  console.log(data)
         for(ind = 0; ind < size; ind++)
               showUserCommunity(data.community[ind])
      }
   })
}


//ham chuyen doi thoi gian so voi hien tai
function Change_date(Date_time)
{
    var second, d, d1, date_now, text; 
    d = new Date();//lay thoi gian hien tai
    d1 = new Date(String(Date_time));//;lay thoi gian da dang
    second = parseInt((d - d1)/1000);//thoi gian hien tai va thoi gian da dang
    if(second < 60) text = "Just now";
    else if(second > 60 && second < 3600)            text =parseInt(second/60)+" Minutes before";
    else if(second >= 3600 && second < 86400)        text = "About "+parseInt(second/3600)+" Hours ago"; 
    else if(second >= 86400 && second < 2592000)     text = parseInt(second/86400)+" Days ago"; 
    else if(second >= 2592000 && second < 946080000) text = parseInt(second/2592000)+" Months ago";
    else                                             text = "Long time ago";     
    return text;                               
}


//khi bi nguoi khac block tin nhan thi tinh nang nay thong bao nguoi dung da bi block
var wasBlock = function(id, name, photo, time){
  alert("you was blocked by " + name + " at " + Change_date(time))
} 

$(document).ready(function(){
    $('[data-toggle="popover"]').popover(); 
});


//xu li su kien moi khi co nguoi online trong cong dong thi hien thi thong bao
//show thong tin nguoi do
var communityUser = []
socket.on('whoonline', function(data){
   var flagcm = false;
   console.log("id of humman just online is " + data.id)
   for(var ind = 0; ind < communityUser.length; ind++){
      if(communityUser[ind].toString() == (data.id).toString()){
         flagcm = true;
         break;
      }
   }

   if(flagcm == false && data.state == false){//data.state = false chung to nguoi dung load trang
      communityUser[communityUser.length] = data.id 
      var popupDiv1 = document.getElementById("myPopupdiv")
      popupDiv1.style.display = "block"
      setTimeout(function() {
          popupDiv1.style.display = "none"
      }, 7000)
   }
})

document.getElementById("myPopupcommunity").onclick = function(e) {
   // body...
   var popupDiv1 = document.getElementById("myPopupdiv")
   popupDiv1.style.display = "none"
   document.getElementById("MycommunityExchange").innerHTML = ""
   getListUserCommnunity(MYID, function(data, err){
      if(err) alert(err)
      else{
         var size = data.community.length;
         var ind = 0;
         for(ind = 0; ind < size; ind++)
            showUserCommunity(data.community[ind])
      }
   })
}