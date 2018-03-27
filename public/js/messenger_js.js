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
		}
		
	})
}

loadUser();

//ham hien thi danh sach nguoi dung
function showUsers(users, setting)
{
	
	var isonline = '<span class="contact-status online"></span>'
	if(users.state != 1)
		var isonline = '<span class="contact-status offline"></span>'

	var element =  '<li class="contact" data-toggle="tooltip" title="Score: '+users.score+'">'+
          '<div class="wrap" onclick="messageUser('+users.id+')">'+
           isonline+//isonline
            '<img src="'+users.photo+'" alt="" />'+
            '<div class="meta">'+
              '<p class="name">'+users.name+'</p>'+
              '<p class="preview">'+users.email+'</p>'+
            '</div>'+
          '</div>'+
          '<input type = "hidden" value="'+users.id+'">'
        '</li>'


    var contact = document.getElementById("contacts")
    var contact_ul = contact.getElementsByTagName("ul")[0]

    contact_ul.innerHTML += element
}



function showMessageuserSend(user, messages, setting){//user la object cua nguoi dung

	var element = '<li class="sent">'+
            '<img src="'+user.photo+'" alt="" />'+
            '<p>'+messages.content+'</br><span style="font-style:italic;font-size:90%;">'+
                  messages.time+'</span></p>'+

		       '<a href="#" style="font-size: 18px;">'+
			       '<span class="glyphicon glyphicon-edit" ></span>'+
		       '</a>'+
		       '<a href="#" style="font-size: 18px;">'+
			      '<span class="glyphicon glyphicon-exclamation-sign"></span>'+
            '</a>'+
		       '<a href="#" style="font-size: 18px;">'+
			      '<span class="glyphicon glyphicon-transfer"></span>'+
		       '</a>'+
        '</li>'+
        '<div class="translate" style="display:none;">'+
            '<p></p>'+
        '</div>'+
        '<div class="misspelling" style="display:none;">'+
            '<p></p>'+
        '</div>'	

    var message = document.getElementById("messagesbox")
    var message_ul = message.getElementsByTagName("ul")[0]

    message_ul.innerHTML += element		
    message.scrollTop =  message.scrollHeight
}



function showMessageuserReceive(user, messages, setting){

	var element = '<li class="replies">'+
            '<table class="settingtbl">'+
            '<tr>'+
               '<td style="vertical-align: super;">'+
               '<div>'+
                  '<a href="#" style="font-size: 18px;">'+
                     '<span class="glyphicon glyphicon-edit" ></span>'+
                  '</a>'+
                  '<a href="#" style="font-size: 18px;">'+
                     '<span class="glyphicon glyphicon-exclamation-sign"></span>'+
                  '</a>'+
                  '<a href="#" style="font-size: 18px;">'+
                     '<span class="glyphicon glyphicon-transfer"></span>'+
                  '</a>'+
               '</div>'+
            '</td>'+

            '<td>'+
               '<img src="'+user.photo+'" alt="" />'+
               '<p>'+messages.content+'</br><span style="font-style:italic;font-size:90%;">'+
                  messages.time+'</span></p>'+
            '</td>'+
           '</tr>'+
            '</table>'+
        '</li>'+
        '<div class="translate" style="float: right;margin-right:6%;display:none;">'+
            '<p></p>'+
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
	loadMessage(uid, function(data){
	//	console.log(data)
      var listLength = data.listmessage.messages.length

      if(listLength > 0)
      {
         var userSend = {}
         var userReceive = {}

         var message = document.getElementById("messagesbox")
         var message_ul = message.getElementsByTagName("ul")[0]
         message_ul.innerHTML = ""

         if(MYID == data.listmessage.userA.id){
            userSend = data.listmessage.userA
            userReceive = data.listmessage.userB
         }else{
           userSend = data.listmessage.userB
           userReceive = data.listmessage.userA
         }

         for(var index = listLength-1; index >= 0; index--){
            if(parseInt(MYID) == parseInt(data.listmessage.messages[index].idA)){//toi la nguoi gui tin nhan
               showMessageuserSend(userSend, data.listmessage.messages[index], null)
            }else{
               showMessageuserReceive(userReceive, data.listmessage.messages[index], null)
            }
         }
      }

	})
}


//tooltip
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});