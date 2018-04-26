
 //thay the tat ca string 'search' trong 'string' bang string 'replacement'
var replaceAll = function(string, search, replacement) {
   return string.replace(new RegExp(search, 'g'), replacement);
}

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
var ajaxRequest = function(url, type, data, callback) {//data is a object
  // body...
  $.ajax({
        type: type,
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

function formatAMPM1(date)
{

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm +" "+ date.getDate() + "/" + (date.getMonth()+1)+
                "/"+date.getFullYear();
 
  return strTime;
}    

var showUserCommunity = function(User)
{
  
	var isOnline='<h4 ><i class="fa fa-circle" style="color:red;"></i><a href="#" style="text-decoration:none;color:black;" '+
            ' data-toggle="popover" title="Des" data-content="'+User.infor.describe+'"> '+User.infor.name+'</a> </h4>'

	var isFollow = "color:#3399FF;"
   var tooltipFollow = "Follow "
   var id = User.infor.id

   var isblockedmsg = '<a href="#" id="'+id+'_turnoncb" onclick="register_popup(event,'+id+',\''+User.infor.name+'\''+", "+'\''+User.infor.photo+'\');" '+
                            ' data-toggle="tooltip" title="Send message" class="icon" >'+
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
    isblockedmsg = '<a href="#" id="'+id+'_turnoncb" onclick="wasBlock('+id+',\''+User.infor.name+'\''+", "+'\''+User.infor.photo+'\',\''+User.infor.iswasblocked.timeblock+'\' );" '+
                            ' data-toggle="tooltip" title="Message blocked" class="icon">'+
                          '<i class="fa fa-comment" style="font-size:36px;color:black;"></i></a>'
  }

  if(User.youblocked){//trong truong hop tim kiem nguoi dung,se tim kiem ca nhung nguoi da block
    isblockedmsg = ""
    followstr = '<div class="alert alert-info"'+
         '<strong>Info!</strong> Bạn đã khóa '+User.infor.name +
         ' At '+formatAMPM1(new Date(User.youblocked.time))+
    '</div>'
  }

  if(User.youwasblocked){
    isblockedmsg = ""
    followstr = '<div class="alert alert-info"'+
         '<strong>Info!</strong> Bạn bị khóa bởi '+User.infor.name +
         ' lúc '+formatAMPM1(new Date(User.youwasblocked.time))+
         ' với Lý do: ' + User.youwasblocked.reason
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
        						'<p class="title">Đang học: <span style="color:blue;">'+User.infor.exlanguage[0].laname+'</span></p>'+
         						'<p class="title">Trình độ: <span style="color:orange;">'+User.infor.exlanguage[0].dename+'</span></p>'+
        						'<p class="title" data-toggle="tooltip" title="score: '+User.infor.score+'">Cấp độ: '+User.infor.level+'</p>'+
        						'<p>Tuổi: '+(new Date().getYear() - new Date(User.infor.dateofbirth).getYear())+'</p>'+
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
var INFORCOMMUNITY = []//global array
getListUserCommnunity(MYID, function(data, err)
{
   console.log(data)
  if(err) alert(err)
  else{
      var size = data.community.length;
      var ind = 0;
      //  console.log(data)
      for(ind = 0; ind < size; ind++){
    	   showUserCommunity(data.community[ind])
         //khoi tao thong tin nguoi dung
         INFORCOMMUNITY[ind] = {}
         INFORCOMMUNITY[ind] = data.community[ind]
      }
  }
})


function viewProfileByImage(uid){
  location.href = "/languageex/user/profile?uid="+encodeURIComponent(uid)
}

var SAVE_ID_HAVE_NOTIFY = []
var showTotalNoftify = function(){
   ajaxRequest('/languageex/home/notifymsg', 'GET', {}, function(data, err){
      if(err) alert(err)
      else{
         for(var ind = 0; ind < data.data.length; ind++)
            SAVE_ID_HAVE_NOTIFY[ind] = data.data[ind].id
         
         if(data.data.length > 0)
            document.getElementById("numofusermessagetoyou").innerHTML = "("+data.data.length+")"
      }
  })
}

//kiem tra xem co ai nhan tin cho khong
showTotalNoftify()

//nhan thong bao tu server
var CONSTANTSTRING = 4566456456//random number
var showContentNotifyMsg = function(DOMelement, data)
{
   var ele = ""
   var ischeckmsg = ""
    console.log(data)
   for(ind = 0; ind < data.data.length; ind++)
   {

      var Userinfor = {
         id: data.data[ind].uid,
         name: data.data[ind].name,
         photo: data.data[ind].photo,
         ischeck: data.data[ind].ischeck
      }

      var isblockedmsg = ""/*tôi đã block ai */
      if(data.data[ind].isblock)
         isblockedmsg = '<span style="color:red;margin-left:2%;" class="glyphicon glyphicon-remove"></span>'
     
      var replacementJSON = replaceAll(JSON.stringify(Userinfor), '"', CONSTANTSTRING)

      if(data.data[ind].wasblock){/* tôi bị block bởi ai*/
           var msg = "Bạn đã bị "+ data.data[ind].name + " khóa tin nhắn lúc "+formatAMPM1(new Date(data.data[ind].time))
           ele += '<tr onclick="alert(\''+msg+'\');">'
      }else{
         if(ind > 0){
            ele += '<tr onclick="messageToUser(\''+replacementJSON+'\')">'
         }else
            ele += '<tr style="border-top:0px;" onclick="messageToUser(\''+replacementJSON+'\')">'
      }

      if(parseInt(data.data[ind].ischeck) < 2)
         ischeckmsg = " ("+data.data[ind].totalmsg+")"

      ele += '<td style="padding: 2%;"><img src="'+data.data[ind].photo+'" '+
                'class="img-circle" alt="Avatar" height="45" width="45"></td>'+
              '<td style="width: 65%;">'+
                '<div style="height: auto;width: auto;margin-left: 2%;">'+
                  '<span style="font-style: italic;font-size: 120%;font-weight: bold;">'+data.data[ind].name+ischeckmsg+'</span></br>'+
                  '<span style="font-size: 95%;">'+data.data[ind].msgcontent+'</span>'+ isblockedmsg+
                '</div>'+
              '</td>'+
              '<td style="width:30%;">'+
                '<div style="float: right;">'+formatAMPM1(new Date(data.data[ind].time))+'</div>'+
              '</td>'+
            '</tr>'

      ischeckmsg = ""
   }

   DOMelement.innerHTML = ele
}


var messageToUser = function(Userinfor)
{
   var UserinfortoOBJ = JSON.parse(replaceAll(Userinfor, CONSTANTSTRING, '"'))
   $('#showNotifyHome').modal('hide')

   /**
      khi có thông báo và nhận được thông báo, người dùng kick vào thông báo để hiển thị các thông
      báo nhắn tin từ người dùng, nếu kick vào 1 trong những người gửi thông báo thì Thông báo giảm 
      đi 1, đồng thời mảng SAVE_ID_HAVE_NOTIFY này-chứa các id thông báo cũng giảm đi 1
   **/
   for(var ind = 0; ind < SAVE_ID_HAVE_NOTIFY.length; ind++){
      if(SAVE_ID_HAVE_NOTIFY[ind] == UserinfortoOBJ.id){
         SAVE_ID_HAVE_NOTIFY.splice(ind, 1)
         break;
      }
   }

   register_popup(null, UserinfortoOBJ.id, UserinfortoOBJ.name, UserinfortoOBJ.photo);

   if(parseInt(UserinfortoOBJ.ischeck) < 2){
      ajaxRequest('/languageex/home/seenmsgnotify', 'PUT', 
         { userA: UserinfortoOBJ.id }, function(data, err){
         if(err) alert(err)
         else{
            var str = document.getElementById("numofusermessagetoyou").innerHTML
            var Totalnotify = parseInt(str.substring(1, str.length -1))-1;
            document.getElementById("numofusermessagetoyou").innerHTML = "("+Totalnotify+")"
         }
      })
   }
}

//hien thi thong bao
var showMyNotify = function(){
   $('#showNotifyHome').modal({backdrop: 'static', keyboard: false})  
  //dosomething 
   var showNotifyHomeModal = document.getElementById("showNotifyHome")
   var showNotifyModal_Title = showNotifyHomeModal.getElementsByClassName("modal-title")[0]
   var showNotifyModal_Body = showNotifyHomeModal.getElementsByClassName("modal-body")[0]
   ajaxRequest('/languageex/home/ntfcontentmsg', 'POST', {}, function(data, err){
      if(err) alert(err)
      else{
         var tablemodal = showNotifyModal_Body.getElementsByClassName("notifymessage")[0]
         showContentNotifyMsg(tablemodal, data)
      }
   })
}

var selectUserCommunity = function(){
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
      ajaxRequest('/languageex/home/unfollow', 'POST', data, function(data, err){
          if(err) alert(err)
          else{ 
             idfollow.style.color = "#3399FF"
             alert("You unfollowed "+ name)
         }
      })
  }else{
    var data = {id: uid, follow: true, time: new Date()} 
    ajaxRequest('/languageex/home/follow', 'POST',data, function(data, err){
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
               "<strong>Danger!</strong>Không tìm thấy kết quả nào phù hợp.</div>"+
               "<button type='button' class='btn btn-link' onclick='backToStart()'>Quay lại</button"
          }else{
            MycommunityExchange.innerHTML = "("+data.community.length+") Kết quả phù hợp."
            for(ind = 0; ind <  data.community.length; ind++){
               showUserCommunity(data.community[ind])
            }
            MycommunityExchange.innerHTML  +=  "<button type='button' class='btn btn-link' onclick='backToStart()'>Quay lại</button"
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
                     "<strong>Danger!</strong>Không tìm thấy kết quả nào phù hợp.</div>"+
                     "<button type='button' onclick='backToStart()' class='btn btn-link'>Quay lại</button"

          }else{
             MycommunityExchange.innerHTML = "("+data.community.length+") Kết quả phù hợp."
            for(ind = 0; ind <  data.community.length; ind++){
               showUserCommunity(data.community[ind])
            }
            MycommunityExchange.innerHTML  +=  "<button type='button' class='btn btn-link' onclick='backToStart()'>Quay lại</button"
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