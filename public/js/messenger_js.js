
var USERCHATNOW = {};//tra ve object infor cua nguoi dung dang nhan tin hien tai(dang click)]
var CONSTANTSTRING = 38492124245347//random number
var SCORING = 0;

//gui du lieu len server
var Translate_or_Misspelling = function(url, myex, mynat, content, cb){
   $.ajax({
      type: "POST",
      url: url,
      data:{nat: mynat, ex: myex, content: content},
      success: function(data)//hien thi message
      {
         if(typeof cb == "function")
            cb(JSON.parse(data));//tra ve du lieu
      }
   })
}

//ham nay chuyen doi phat hien tu ngu nao sai va cach sua doi tuong ung, [convert]=>convert
var matchMisspelling = function(content, newcontent){
   var space = content.split(" ")//lay cac tu trong doan van ban
   var newspace = newcontent.split(" ")
   var str = ""
   for(var ind = 0; ind < space.length; ind++){
      if(newspace[ind][0] == "["){
         str += "<span>"+space[ind]+" => "+newspace[ind].substr(1, newspace[ind].length-2)
         str += "</span></br>"
      }
   }

   return str
}

var HTTP_REQUEST = function(url, type, data, cb){
   // Set up the AJAX request.
    var xhr = new XMLHttpRequest();
    // Open the connection.
    xhr.open(type, url, true);

    var formData;

    formData = JSON.stringify({data: data})
    xhr.setRequestHeader("Content-type", "application/json");

    // Set up a handler for when the request finishes.
    xhr.onload = function () {
        if (xhr.status === 200){
            console.log("da chay thanh cong ham request")
        }
        else{
         cb("An unknown error. ", null)
            console.log("xay ra loi khong xac dinh. Sorry!!!")
        }
    };

    // Send the Data to server
    xhr.send(formData);

    //take data from server responsible
    xhr.onreadystatechange = function(){
      //State = 4 is request finished and response is ready, xhr.status == 200 is 200: "OK"
        if(xhr.readyState == 4){
         if(xhr.status === 200){
            var data_response = JSON.parse(xhr.responseText);
               cb(null, data_response)
            }else{
               var err = "Status code err: " + xhr.status
               cb(err, null)
            }
        }
    }
}

//take query string in url js
//tham khao https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function makerandomid(){
   var text = "";
   var possible = "0123456789";

   for( var i = 0; i < 20; i++ )//ma xac thuc co ngau nhien 45 ki tu
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   return text;
}

//thay the tat ca string 'search' trong 'string' bang string 'replacement'
var replaceAll = function(string, search, replacement) {
   return string.replace(new RegExp(search, 'g'), replacement);
}  

function formatAMPM(date)
{
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  return strTime;
}     

function formatTime(date)
{
   var hours = date.getHours() + 7;
   if(hours > 23) hours = hours - 24

   var minutes = date.getMinutes();
   var days = date.getDate();
   var months = date.getMonth() + 1;//getMonth() return 0-11
   var years = date.getFullYear();

   minutes = minutes < 10 ? '0'+ minutes : minutes;
   var strTime = hours + ':' + minutes + ' ' + days + '/' + months;

   if((new Date()).getFullYear() != years)
      strTime = days + '/' + months + '/' +years

   return strTime;
}       

function Logout(){
    location.href = '/languageex/user/logout'
}

//ham load nguoi dung tu server
function loadUserfromServer(cb){
	$.ajax({
        type: "POST",
        url: "/languageex/user/loasdusermsg",
        data:{},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
               cb(JSON.parse(data));//tra ve du lieu
        }
    })
}

//ham load tin nhan voi nguoi dung cu the tu server
function loadMessage(uid, cb){

	$.ajax({
        type: "GET",
        url: "/languageex/user/messages?uid="+encodeURIComponent(uid),
        data:{},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
                cb(JSON.parse(data));//tra ve du lieu
        }
    })
}


// lay nguoi dung tu csdl ve

var loadUser = function(){
	loadUserfromServer(function(data){
		var index = 0;
		console.log(data)

		if(data.listuser.length > 0){
			var contact = document.getElementById("contacts")
    		var contact_ul = contact.getElementsByTagName("ul")[0]
    		contact_ul.innerHTML = ""

			for(index = 0; index < data.listuser.length; index++){
				showUsers(data.listuser[index], null)
			}

         var userid = getParameterByName("uid", location.href)
         var finduser = false;
         if(userid){
            for(index = 0; index < data.listuser.length; index++){
               if(data.listuser[index].id == userid){
                  messageUser(data.listuser[index].id)
                  finduser = true
                  break;
               }
            }

            if(!finduser){// neu khong tim thay nguoi dung trong danh sach hien tai, load tu server
                HTTP_REQUEST('/languageex/user/loasdspecuser', 'POST', {pid: userid}, 
                function(err, data){
                  if(err) alert(err)
                  else{
                     if(data.listuser.length > 0){
                        showUsers(data.listuser[0], null)
                        messageUser(data.listuser[0].id)
                     }
                     else{
                        alert("Không tồn tại người dùng này.Vui lòng thử lại.")
                        location.href = "/languageex/messenger"
                     }
                  }
               })
            }
         }else{
            //click vao nguoi dung khong bị khóa tin nhắn
            for(index = 0; index < data.listuser.length; index++){
               if(data.listuser[index].bltime == null && data.listuser[index].bl1time == null){
                  messageUser(data.listuser[index].id)//tra ve nguoi dau tien trong danh sach
                  break;
               }
            }
            
         }
		}
		
	})
}

loadUser();

//ham hien thi danh sach nguoi dung
function showUsers(users, setting)
{
	var isonline = '<span class="contact-status online"></span>'
   var Funcblock = 'onclick="messageUser('+users.id+')"'

	if(users.state != 1)
		isonline = '<span class="contact-status offline"></span>'
   

   if(users.bltime){// toi block nguoi khac
      isonline = '<span class="contact-status away"></span>'
      Funcblock = 'onclick="youBlocked('+users.id+')"'
   }

   if(users.bl1time){//toi bi nguoi khac block
      isonline = '<span class="contact-status busy"></span>'
       Funcblock = 'onclick="youwasBlocked('+users.id+')"'
   }

   var replacementJSON = replaceAll(JSON.stringify(users), '"', CONSTANTSTRING)

	var element = '<li class="contact" id="'+users.id+'_identity" '+
              'data-toggle="tooltip" title="Score: '+users.score+'" ">'+
          '<div class="wrap" '+Funcblock+'>'+
           isonline+//isonline
            '<img src="'+users.photo+'" alt="" />'+
            '<div class="meta">'+
              '<p class="name">'+users.name+'</p>'+
              '<p class="preview">'+users.email+'</p>'+
            '</div>'+
          '</div>'+
          '<input id="'+users.id+'_hiddeninfouser" type = "hidden" value="'+replacementJSON+'">'
        '</li>'


    var contact = document.getElementById("contacts")
    var contact_ul = contact.getElementsByTagName("ul")[0]

    contact_ul.innerHTML += element

}

function youwasBlocked(id){
   alert("Bạn đã bị người dùng này khóa tin nhắn.")
   document.getElementById("contentMessage").disabled = true;
}

function youBlocked(id){
   alert("Bạn đã khóa tin nhắn với người dùng này.")
   document.getElementById("contentMessage").disabled = true;
}


function showMessageuserSend(user, messages, setting, state){//user la object cua nguoi dung

   var Time;
   var rid = parseInt(makerandomid())//tao 1 id random cho moi tin nhan

   if(state == 1)
      Time = formatTime(new Date(messages.time))
   else
      Time = formatAMPM(new Date())

	var element = '<li class="sent">'+
            '<img src="'+user.photo+'" alt="" />'+
            '<p>'+messages.content+' (<span style="font-style:italic;font-size:90%;">'+
                 Time+')</span></p>'+
		   //    '<a href="#" style="font-size: 18px;">'+
			//       '<span class="glyphicon glyphicon-edit" ></span>'+
		   //    '</a>'+
		  //     '<a href="#" style="font-size: 18px;">'+
			//      '<span class="glyphicon glyphicon-exclamation-sign"></span>'+
        //    '</a>'+
		       '<a href="#" style="font-size: 18px;">'+
			      '<span class="glyphicon glyphicon-transfer"'+
                 ' onclick="AutoTranslate('+user.id+','+rid+',\''+messages.content+'\')"></span>'+
		       '</a>'+
              '<div style="font-size:80%;margin-left:7%;display:none;" class="'+USERCHATNOW.id+'_seen">seen at '+Time+'</div>'+

              '</br>'+
               '<p id="'+rid+'_translate" style="margin-left:5%;background:white;color:black;margin-top:2px;display:none;">'+
               '</p>'+
        '</li>'+
        
        '<div class="misspelling" style="display:none;">'+
            '<p></p>'+
        '</div>'	

    var message = document.getElementById("messagesbox")
    var message_ul = message.getElementsByTagName("ul")[0]

    message_ul.innerHTML += element		
    message.scrollTop =  message.scrollHeight
}



function showMessageuserReceive(user, messages, setting, state){

   var rid = parseInt(makerandomid())//tao 1 id random cho moi tin nhan

   var Time;
   if(state == 1)
      Time = formatTime(new Date(messages.time))
   else
      Time = formatAMPM(new Date())

	var element = '<li class="replies">'+
            '<table class="settingtbl">'+
            '<tr>'+
               '<td style="vertical-align: super;">'+
               '<div>'+
               //   '<a href="#" style="font-size: 18px;">'+
              //       '<span class="glyphicon glyphicon-edit" ></span>'+
             //     '</a>'+
             //     '<a href="#" style="font-size: 18px;">'+
             //        '<span class="glyphicon glyphicon-exclamation-sign"></span>'+
                  '</a>'+
                  '<a href="#" style="font-size: 18px;">'+
                     '<span class="glyphicon glyphicon-transfer" '+
                        'onclick="AutoTranslate('+user.id+','+rid+',\''+messages.content+'\')"></span>'+
                  '</a>'+
               '</div>'+
            '</td>'+

            '<td>'+
               '<img src="'+user.photo+'" alt="" />'+
               '<p>'+messages.content+'   <span style="font-style:italic;font-size:90%;">('+
                 Time+')</span></p>'+
            '</td>'+
           '</tr>'+
            '</table>'+
        '</li>'+
        '<div class="translate" id="'+rid+'_translate" style="float:right;margin-right:6%;'+
             'word-wrap:break-word;margin-top:-1%;background-color:#3366FF;display:none;">'+
        '</div>'+
        '<div class="misspelling" style="float: right;margin-right:6%;display:none;">'+
            '<p></p>'+
        '</div>'

    var message = document.getElementById("messagesbox")
    var message_ul = message.getElementsByTagName("ul")[0]

    message_ul.innerHTML += element	
    message.scrollTop =  message.scrollHeight

}

//event lay tin nhan
var messageUser = function(uid)
{

   document.getElementById("contentMessage").disabled = false;

  var infoUser = document.getElementById(uid+"_hiddeninfouser").value
  var users = JSON.parse(replaceAll(infoUser, CONSTANTSTRING, '"'))
   //khoi tao object
  USERCHATNOW.id = users.id
  USERCHATNOW.photo = users.photo
  USERCHATNOW.email = users.email
  USERCHATNOW.name = users.name

  document.getElementById("user_pid_src").src = users.photo
  document.getElementById("user_pid_name").innerHTML = users.name
  
  socket.emit('createroomchat', {myid: MYID, pid: USERCHATNOW.id})//gui tin hieu tao room chat
  var changeDOMcolorclick = document.getElementById(uid+ "_identity")
  //xoa het cac background color truoc do
  var allUserDOM = document.getElementsByClassName("contact")
 
  for(var ind = 0; ind < allUserDOM.length; ind++){
    allUserDOM[ind].style.backgroundColor = "#243140"
  }
  changeDOMcolorclick.style.backgroundColor = "#FF3300"

	loadMessage(uid, function(data){
	//	console.log(data)
      var message = document.getElementById("messagesbox")
      var message_ul = message.getElementsByTagName("ul")[0]
      message_ul.innerHTML = ""
      if(data.listmessage){
         var listLength = data.listmessage.messages.length
         if(listLength > 0)
         {
            var userSend = {}
            var userReceive = {}         

            if(MYID == data.listmessage.userA.id){
               userSend = data.listmessage.userA
               userReceive = data.listmessage.userB
            }else{
               userSend = data.listmessage.userB
            userReceive = data.listmessage.userA
            }

            for(var index = listLength-1; index >= 0; index--){
               if(parseInt(MYID) == parseInt(data.listmessage.messages[index].idA)){//toi la nguoi gui tin nhan
                  showMessageuserSend(userSend, data.listmessage.messages[index], null, 1)
               }else{
                  showMessageuserReceive(userReceive, data.listmessage.messages[index], null, 1)
               }
            }
         }
      }
	})
}


//gui tin nhan khi nhan enter
var SendMessage = function(e){
   var seenmsg = document.getElementsByClassName(USERCHATNOW.id+"_seen")
   if(seenmsg.length > 0)
      seenmsg[seenmsg.length-1].style.display = "none"

   if(e.keyCode == 13)
   {
      var time = formatAMPM(new Date());
      var contentmsg = document.getElementById("contentMessage").value
   
      if(contentmsg.length > 0){
         //tao object
         var message = {}
         message.content = contentmsg
         message.data = null
         message.edit = []//khoi tao rong
         //nhan tin thi diem tang len
         SCORING = 1;

         HTTP_REQUEST('/languageex/user/score', 'POST', {score: SCORING}, 
            function(err, data){
               if(err) alert(err)
         })

         var myinfo = {
            id : USERCHATNOW.id,//id cua doi phuong
            photo : MYPHOTO,
            email : MYEMAIL,
            name : MYNAME
         }

         showMessageuserSend(myinfo, message, null, 0)

         var ismisspelling = 0;//khong co loi dich, tin nhan ok
         Translate_or_Misspelling("/languageex/user/translate", 
            MYPRIOEX, MYPRIONAT, contentmsg, function(data){

            if(data.content.error == null){
               if(data.content.value==""){
                  ismisspelling = 0;//tin nhan ok
               }else{
                  if(data.content.language == MYPRIOEX)
                     ismisspelling = 1;//co loi chinh ta
                  else
                     ismisspelling = 2//khong phai ngon ngu dang trao doi
               }
            }else
                  ismisspelling = 3;//loi dich tin nhan

            message.misspelling = ismisspelling
            
            socket.emit('sendmsg', {
               content: message,
               time: new Date(),
               myid: MYID,
               photo: MYPHOTO,
               pid: USERCHATNOW.id
            }) 
         })

         document.getElementById("contentMessage").value = ""//reset hop thoai
         var message1 = document.getElementById("messagesbox")
         message1.scrollTop =  message1.scrollHeight
      }


   }else{//nguoi dung dang nhap ban phim
      socket.emit('chatting', {
         myid: MYID,
         pid: USERCHATNOW.id
      })  
   }

}

//nhan tin nhan cua nguoi gui
socket.on('receivermsg', function(data)
{
   var time = formatAMPM(new Date(data.time));
   if(USERCHATNOW.id == parseInt(data.id_send))
   {
      var seenmsg = document.getElementsByClassName(data.id_send+"_seen")
      if(seenmsg.length > 0)
         seenmsg[seenmsg.length-1].style.display = "none"

      var user = {
         id: data.id_send,
         photo: USERCHATNOW.photo,
      }
    
      var message = {
         content: data.content.content,
         time: data.time
      }

      showMessageuserReceive(user, message, null, 0)

      document.getElementById("liuseristyping").style.display = "none"

      $('#contentMessage').on("focus", function(){
         socket.emit('isseemsg', { myid: MYID, pid: data.id_send })             
      })
   }
})

//gui tin nhan khi nhan nut send
var WriteMessage = function(){
   var time = formatAMPM(new Date());
   var contentmsg = document.getElementById("contentMessage").value
   if(contentmsg.length > 0){
      //nhan tin thi diem tang len
      SCORING = 1;
      HTTP_REQUEST('/languageex/user/score', 'POST', {score: SCORING}, 
         function(err, data){
            if(err) alert(err)
         })
      //tao object
      var message = {}
      message.content = contentmsg
      message.data = null
      message.edit = []//khoi tao rong

      var myinfo = {
         id : USERCHATNOW.id,//id cua doi phuong
         photo : MYPHOTO,
         email : MYEMAIL,
         name : MYNAME
      }

      showMessageuserSend(myinfo, message, null, 0)

      var ismisspelling = 0;//khong co loi dich, tin nhan ok
      Translate_or_Misspelling("/languageex/user/translate", 
         MYPRIOEX, MYPRIONAT, contentmsg.value, function(data){

         if(data.content.error == null){
            if(data.content.value==""){
               ismisspelling = 0;//tin nhan ok
            }else{
               if(data.content.language == MYPRIOEX)
                  ismisspelling = 1;//co loi chinh ta
               else
                  ismisspelling = 2//khong phai ngon ngu dang trao doi
            }
         }else
            ismisspelling = 3;//loi dich tin nhan

         message.misspelling = ismisspelling
         socket.emit('sendmsg', {
            content: message,
            time: new Date(),
            myid: MYID,
            photo: MYPHOTO,
            pid: USERCHATNOW.id
         }) 
      })

      document.getElementById("contentMessage").value = ""//reset hop thoai
      var message1 = document.getElementById("messagesbox")
      message1.scrollTop =  message1.scrollHeight
   }

}

var TIME_TYPING = 4500;
socket.on('typing...', function(data){
 
   if(parseInt(data.myid) == parseInt(USERCHATNOW.id)){
      document.getElementById("liuseristyping").style.display = "block"
       document.getElementById("useristyping").src = USERCHATNOW.photo
      setTimeout(function(){
         document.getElementById("liuseristyping").style.display = "none"
      }, TIME_TYPING)
                  
   }
})

socket.on('seen', function(data){
   var seenmsg = document.getElementsByClassName(data.myid+"_seen")
   if(seenmsg.length > 0)
      seenmsg[seenmsg.length-1].style.display = "block"
   })   

//tooltip
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

var TIMEMAXSHOWTRANS = 15000;
var AutoTranslate = function(id, rid, content){
   var DOM_show_msg = document.getElementById(rid + "_translate")

   var data = {
      nat: MYPRIONAT,
      content: content
   }

   HTTP_REQUEST('/languageex/user/transbymatch', 'POST', data, function(err, data){
      if(err) alert(err)
      else{

         DOM_show_msg.style.display = "block"
         if(data.content.err){
            DOM_show_msg.innerHTML = "Some error here. Can not translate."
         }else{
            DOM_show_msg.innerHTML = "Matched: <span style='color:green;'>" + data.content.from+"</span></br>"
            if(data.content.didYouMean || data.content.autoCorrected)
               DOM_show_msg.innerHTML += "Suggest: <span style='color:green;'>" +
                  matchMisspelling(content, data.content.successChange) +
                  "</span></br>"
            DOM_show_msg.innerHTML += "Trans: <span style='color:green;'>" + data.content.translated +"</span>"
            setTimeout(function(){
               DOM_show_msg.style.display = "none"
            }, TIMEMAXSHOWTRANS)
         }
        
      } 
   })
}

//search contact khi nhan nut search
var searchContactClick = function(){
   var contactvl = document.getElementById("contactvalue")
   if(contactvl.value != ""){
      HTTP_REQUEST('/languageex/user/loadusercondi', 'POST', {search: contactvl.value}, 
         function(err, data){
            if(err) alert(err)
            else{
               if(data.listuser.length > 0){
                  var contact = document.getElementById("contacts")
                  var contact_ul = contact.getElementsByTagName("ul")[0]
                  contact_ul.innerHTML = ""

                  for(index = 0; index < data.listuser.length; index++){
                     showUsers(data.listuser[index], null)
                  }
               }
            }
      })
   }
}

//search contact khi an enter
var searchContactPress = function(e){
   var contactvl = document.getElementById("contactvalue")
   if(e.keyCode == 13){
      if(contactvl.value != ""){
         HTTP_REQUEST('/languageex/user/loadusercondi', 'POST', {search: contactvl.value}, 
            function(err, data){
               if(err) alert(err)
               else{
                  if(data.listuser.length > 0){
                     var contact = document.getElementById("contacts")
                     var contact_ul = contact.getElementsByTagName("ul")[0]
                     contact_ul.innerHTML = ""

                     for(index = 0; index < data.listuser.length; index++){
                        showUsers(data.listuser[index], null)
                     }
                  }
               }
         })
      }
   }
}