

           var INPUT_HIDDEN_SAVE_MSSID = "";//su dung bien nay de luu tru input hidden-luu msg id=>edit msg
           var CONSTANTSTRING = 38492124245347//random number
           var SCORING = 0;//tinh diem cho moi tin nhan

           //this function can remove a array element.
            Array.remove = function(array, from, to) {
                var rest = array.slice((to || from) + 1 || array.length);
                array.length = from < 0 ? array.length + from : from;
                return array.push.apply(array, rest);
            };
			
		
            //this variable represents the total number of popups can be displayed according to the viewport width
            var total_popups = 0;
            
            //arrays of popups ids
            var popups = [];
			
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

            //return sql string date format
            function getDateTime(date){
                return date.getFullYear() +
                 '-' + (date.getMonth() + 1) +
                 '-' + (date.getDate()) +
                 ' ' + (date.getHours()) +
                 ':' + (date.getMinutes()) +
                 ':' + (date.getSeconds());
            }     

            //ham nay chuyen doi phat hien tu ngu nao sai va cach sua doi tuong ung, [convert]=>convert
            var matchMisspelling = function(content, newcontent){
                content = content.trim()//bo ki tu trong o dau va cuoi string
                var space = content.split(" ")//lay cac tu trong doan van ban
                var newspace = newcontent.split(" ")
                var str = ""
            
                for(var ind = 0; ind < newspace.length; ind++){
                    var word = newspace[ind].toString()
                    if(word.length > 0 && word[0] == "["){
                        str += "<span>"+space[ind]+" => "+newspace[ind].substr(1, newspace[ind].length-2)
                        str += "</span></br>"
                    }
                }

                return str
            }
        
            //this is used to close a popup
            function close_popup(id)
            {
            	console.log("gui tin hieu out room")
                socket.emit('leaveroomchat', {myid: MYID, pid: id}) 
                
                for(var iii = 0; iii < popups.length; iii++)
                {
                    if(id == popups[iii]){
                        Array.remove(popups, iii); 
                        document.getElementById(id).style.display = "none";
                        calculate_popups();  
                        return;
                    }
                }  
            }
        
            //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
            function display_popups()
            {
                var right = 220;
                
                var iii = 0;
                for(iii; iii < total_popups; iii++)
                {
                    if(popups[iii] != undefined)
                    {
                        var element = document.getElementById(popups[iii]);
                        element.style.right = right + "px";
                        right = right + 320;
                        element.style.display = "block";
                        var scrollPopUp = document.getElementById(popups[iii]+"_scrollmsg")
                        scrollPopUp.scrollTop = scrollPopUp.scrollHeight

                        //load message
                        scrollPopUp.onscroll = function(){
                            if(scrollPopUp.scrollTop == 0){
                            //    alert("xin chao")
                            }
                        }
                    }
                }
                
                for(var jjj = iii; jjj < popups.length; jjj++)
                {
                    var element = document.getElementById(popups[jjj]);
                    element.style.display = "none";
                }
            }

            var takecontentMessage = function(id, cb){
            	$.ajax({
                    type: "POST",
                    url: "/languageex/user/messages",
                    data:{anotherid: id},
                    success: function(data)//hien thi message
                    {
                        if(typeof cb == "function")
                       		cb(JSON.parse(data));//tra ve du lieu
                    }
                })
            }


            var takeSettingMessage = function(id, cb){
            	$.ajax({
                    type: "POST",
                    url: "/languageex/user/loadmsgsetting",
                    data:{anotherid: id},
                    success: function(data)//hien thi message
                    {
                        if(typeof cb == "function")
                       		cb(JSON.parse(data));//tra ve du lieu
                    }
                  })
            }

            //send data to server under json object
            var REQUEST_AJAX_SERVER = function(url, type, data, cb){
                var xhr = new XMLHttpRequest();
                xhr.open(type, url, true);
                var formData;

                formData = JSON.stringify({data: data})
                xhr.setRequestHeader("Content-type", "application/json");
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

            
            //creates markup for a new popup. Adds the id to popups array.
            function register_popup(event, id, name, photo)
            {
                if(event)
                    event.preventDefault()

                socket.emit('createroomchat', {myid: MYID, pid: id})

                for(var iii = 0; iii < popups.length; iii++)
                {   
                    //already registered. Bring it to front.
                    if(id == popups[iii]){
                        Array.remove(popups, iii);
                        popups.unshift(id);
                        calculate_popups(); 
                        return;
                    }
                }               
                
                //load message setting and content message
                takeSettingMessage(id, function(setting)
                {
                   //  console.log(setting)
                    sessionStorage.setItem("_block_"+id, false);
                    sessionStorage.setItem("_checkmiss_"+id, false);
                    if(setting.settingmsg){//co ton tai setting
                        if(setting.settingmsg.blockmsg){
                            sessionStorage.setItem("_block_"+id, true);
                        }
                        if(setting.settingmsg.misspelling)
                            sessionStorage.setItem("_checkmiss_"+id, true);
                    }
                    
                	takecontentMessage(id, function(content)
                    {
               			document.getElementsByTagName("nav")[0].innerHTML += 
               				Show_pop_up_message(id, name, photo, setting); 
                        var myMessages = {}

                    //    console.log(content)
                        if(content.listmessage)
                            myMessages = content.listmessage.messages

                        if(myMessages.length > 0){
                            var myInfo = {}, 
                            pInfo = {}

                            if(content.listmessage.userA == MYID){
                                myInfo = content.listmessage.userA
                                pInfo = content.listmessage.userB
                            }else{
                                myInfo = content.listmessage.userB
                                pInfo = content.listmessage.userA
                            }

                            //show all message
                            document.getElementById(id+"_content").innerHTML = "";
                            for(var ind = myMessages.length-1; ind >= 0; ind--){
                                if(MYID == myMessages[ind].idA){//toi la nguoi gui
                                    Message_send(id, myMessages[ind].time, myInfo.photo, myMessages[ind], 1)
                                }else{
                                    Message_receiver(id, myMessages[ind].time, pInfo.photo, myMessages[ind], 1)
                                }
                            }   
                        }

                        //co block message hay khong
                        if(typeof sessionStorage.getItem("_block_"+id) !='undefined'){
                            if(sessionStorage.getItem("_block_"+id) == "true"){
                                document.getElementById(id + "_mymsg").disabled = true;
                                alert("You blocked messages with " + name)
                            }
                        }

						popups.unshift(id);
                        calculate_popups();

                        var scrollEventBoxChat = document.getElementById(id+"_scrollmsg")
                        scrollEventBoxChat.scrollTop = scrollEventBoxChat.scrollHeight
						//show data to user

                	})
                })

            }
			
			//su kien nhap tin nhan cua nguoi dung
            //takeidmsg la bien de 
			function writeMessage(e, id, photo)
			{	
				//xóa dòng đã xem tin nhắn
				var seenmsg = document.getElementsByClassName(id+"_seen")
				if(seenmsg.length > 0)
					seenmsg[seenmsg.length-1].style.display = "none"

	          	if(e.keyCode == 13){
	          		var time = formatAMPM(new Date());
					var val = document.getElementById(id + "_mymsg").value;

					if(val.length > 0)
                    {
                        //tao object
                        var message = {}
                        message.content = val
                        message.data = null
                        message.edit = []//khoi tao rong

						Message_send(id, time, MYPHOTO, message, 0)

                     //   console.log("gia tri la " +INPUT_HIDDEN_SAVE_MSSID)
                        var ismisspelling = 0;//khong co loi dich, tin nhan ok
                        Translate_or_Misspelling("/languageex/user/checkmisspelling", 
                         MYPRIOEX, MYPRIONAT, val, function(data){

                           if(data.content.error == null){
                                if(data.content.value==""){
                                    ismisspelling = 0;//tin nhan ok
                                }else{
                                    if(data.content.language == MYPRIOEX)
                                        ismisspelling = 1;//co loi chinh ta(đỏ)
                                    else
                                        ismisspelling = 2//khong phai ngon ngu dang trao doi(vàng)
                                }
                           }else
                                ismisspelling = 3;//loi dich tin nhan(cam)

                            SCORING = 1;
                            REQUEST_AJAX_SERVER('/languageex/user/score', 'POST', {score: SCORING}, 
                                function(err, data){
                                    if(err) alert(err)
                            })
                         //  console.log("gia tri la: " + ismisspelling)
                            message.misspelling = ismisspelling
						    socket.emit('sendmsg', {
							   content: message,
							   time: new Date(),
                        	   myid: MYID,
                        	   photo: MYPHOTO,
                        	   pid: id
						    }) 
                        })
						//reset input box
						document.getElementById(id + "_mymsg").value = "";

					    }
			  	    }else{//nguoi dung dang nhap ban phim
			  		socket.emit('chatting', {
                     	myid: MYID,
                     	pid: id
                  })  
			  	   }
            }

            //luu ma tin nhan vua gui di trong input hidden
            socket.on('sendmsgid', function(data){
                if(data.myid == MYID){
                    var savemsgid = document.getElementById(INPUT_HIDDEN_SAVE_MSSID+"_saveidms")
                    savemsgid.value = data.msgid
                    console.log("messageid " + savemsgid.value)
                }
            })

            //nhan tin nhan cua nguoi gui
            socket.on('receivermsg', function(data)
            {
            	var time = formatAMPM(new Date(data.time));
            	if(MYID == parseInt(data.id_receive)){

            		var seenmsg = document.getElementsByClassName(data.id_send+"_seen")
            		if(seenmsg.length > 0)
						seenmsg[seenmsg.length-1].style.display = "none"

            	 	Message_receiver(data.id_send, time, data.myphoto, data.content, 0)
            	    document.getElementById(data.id_send+"_typing").style.display = "none"

          			$('#'+data.id_send+'_mymsg').on("focus", function(){
          				//console.log("check event focus")
          				//if($(this).is(':focus')){}//if focus
          				socket.emit('isseemsg', { myid: MYID, pid: data.id_send })
          				
          			})
            	}
            })

            socket.on('seen', function(data){
				var seenmsg = document.getElementsByClassName(data.myid+"_seen")
				if(seenmsg.length > 0)
					seenmsg[seenmsg.length-1].style.display = "block"
		    })	
            
            var TIME_TYPING = 4500;
            //nguoi dung dang nhap tin nhan
            socket.on('typing...', function(data){
            	//xóa dòng đã xem tin nhắn
            	var seenmsg = document.getElementsByClassName(data.myid+"_seen")
            	if(seenmsg.length > 0)
					seenmsg[seenmsg.length-1].style.display = "none"

            	if(parseInt(data.pid) == parseInt(MYID)){
            		document.getElementById(data.myid+"_typing").style.display = "block"
            		setTimeout(function(){
            			document.getElementById(data.myid+"_typing").style.display = "none"
            		}, TIME_TYPING)
            		
            	}
            })

            //calculate the total number of popups suitable and then populate the toatal_popups variable.
            function calculate_popups()
            {
                var width = window.innerWidth;
                if(width < 540){
                    total_popups = 0;
                }
                else{
                    width = width - 200;
                    //320 is width of a single popup box
                    total_popups = parseInt(width/320);
                }
                display_popups();
            }
            
            //recalculate when window is loaded and also when window is resized.
            window.addEventListener("resize", calculate_popups);
            window.addEventListener("load", calculate_popups);
			
			
			function Show_pop_up_message(id, name, photo, setting)
			{
				var misspellings = ""//tu dong check loi chinh ta
            var checkblockmsg = '<label><input type="checkbox" onclick="Blockmessages(this,'+id+',\''+name+'\')"> Block messages</label>'//check co bi block message khong
               
            if(sessionStorage.getItem("_block_"+id) == "true"){
               checkblockmsg = '<label><input type="checkbox" onclick="Blockmessages(this,'+id+',\''+name+'\')" checked> Block messages</label>'
            }

            if(sessionStorage.getItem("_checkmiss_"+id) == "false")
               misspellings = "checked"

				var element = '<div class="popup-box-chat" id="'+ id +'">' + 
									   '<div style="background-color:  #5b5bef;height: 10%;">' + 
                                 '<div style="height:100%;display:table;float:left;width:70%;" data="tooltip" title="'+id+'">' + 
				                       '<a href = "/languageex/user/profile?uid='+id+'"><p style="font-size:110%;color:black;margin-left:6%;margin-top:4%;">' +
                                       '<b><i>'+ name +'</i></b>' +
											  '</p></a>' +
									      '</div>' +   
                                 '<div style="float:right;width:30%;">' + 
				                       '<div style="float:left;width:50%;margin-top:10%;">' + 
				                          '<div class="dropdown">' + 
				                             '<a style="color: black;font-size:18px;cursor:pointer;" class="dropdown-toggle" data-toggle="dropdown">' + 
													      '<span class="glyphicon glyphicon-cog"></span>' + 
													   '</a>' + 
				                              '<ul class="dropdown-menu" style="z-index:999;">' + 
													     '<li><div class="checkbox" style="margin-left:10%;">' +
      														'<label><input type="checkbox" '+misspellings+' onclick="Auto_check_miss(this,'+id+')"> Auto misspellings</label>'+
   														'</div></li>' + 
   														'<li><a href="/languageex/messenger?uid='+id+'">Open in messenger</a></li>' + 
														   '<li><div class="checkbox" style="margin-left:10%;">' +
      															checkblockmsg+
   														 '</div></li>' +
   														'<li><a href="#" onclick="translatePrio()">Translations priority</a></li>' + 
   														'<li><a href="#" onclick="misspellingPrio()">Misspellings priority</a></li>' + 
														   '<li><a href="#" onclick="delConversation('+id+',\''+name+'\')">Delete Conversation</a></li>' + 
														   '<li><a href="#" onclick="reportUser('+id+',\''+name+'\')">Report <span style="color:orange;">'+name+'</span></a></li>' +
														'</ul>' + 
				                           '</div>' + 
											   '</div>' + 
											 
				                       '<div style="float:right;width:50%;margin-top:4%;">' + 
											      '<button class="close1 close2" onclick="close_popup(\''+id+'\')">X</button>' + 
											  '</div>' + 
					
                                 '</div>' + 
								      '</div>' + 
				
                              '<div style="height:80%;width:100%;background-color:#CCCCCC;overflow:auto;" id="'+id+'_scrollmsg">' + //#bcd1c6
                                 '<div style="text-align: center; margin-top:3%;">Welcome to talk with <span style="color:red;">'+ name +'</span></div>'+
                                 '<div><ul id="'+id+'_content" class="ulclass"></ul></div>' + //content message
									   
										   '<div style="background-color:#CCCCCC;z-index:1;display:none;bottom: 0;" id="'+id+'_typing">' +
									         '<img src="'+photo+'" class="img-rounded" alt="Anh dai dien" width="40" height="40" style="margin-top:-1%;">' + 
										      '<span>.....</span>' + 
										      '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>' + 
										      '<span>.....</span>' + 
								         '</div>' +
                              '</div>' +
							
                              '<div style="margin-top:5px;box-shadow: 1px 2px 5px #ccccff;height: 10%;">' + 
                                 '<input type = "text" placeholder= "Viết tin nhắn..." id = "'+id+'_mymsg"'+
                                       ' style="width:85%;height:88%;border:0px;outline-width:0;" autofocus onkeypress="writeMessage(event,\''+id+'\')">'+ 
				                    '<a style = "margin-left: 2px;"><i class="fa fa-microphone" style="font-size:20px" onclick="msgRecord('+id+')"></i></a>' + 
				                    '<a style = "margin-left: 5px;"><i class="fa fa-video-camera" style="font-size:22px" onclick="callVideoOneToOne(\''+id+'\', \''+name+'\', \''+photo+'\')"></i></a>' + 
                              '<div style="clear: both;"></div>'+
									'</div>'+
                        '</div>' // end    
				return element;
				
			}
			

			function makerandomid(){
    			var text = "";
    			var possible = "0123456789";

    			for( var i = 0; i < 20; i++ )//ma xac thuc co ngau nhien 45 ki tu
        			text += possible.charAt(Math.floor(Math.random() * possible.length));
    			return text;
			}

         //tinh toan mau sac hien thi tren thanh checkmisspeliing
         function calCheckmiss(value){
            var changeclmisspell;

            if(value == 2)//khong dung ngon ngu trao doi
               changeclmisspell = "color: yellow;"
            else if(value == 1)//co loi chinh ta
               changeclmisspell = "color: red;"
            else if(value == 3)//lỗi dịch tin nhắn
               changeclmisspell = "color: orange;"
            else changeclmisspell = "";

            return changeclmisspell;
         }

            //thay the tat ca string 'search' trong 'string' bang string 'replacement'
            var replaceAll = function(string, search, replacement) {
                return string.replace(new RegExp(search, 'g'), replacement);
            }

         //   var replaceAll1 = function(string, search, replacement) {
        //        return target.split(search).join(replacement);
        //    };

            //bien state de check la day la load tin nhan tu server hay nguoi dung dang nhan tin
			function Message_send(id, date, photo, message, state)
			{
				   var rid = parseInt(makerandomid())
	            var content  = message.content
               var Time, msgid = "";

               var changeclmisspell = calCheckmiss(message.misspelling)//tinh toan gia tri
               INPUT_HIDDEN_SAVE_MSSID = rid;

                if(message.messageid)
                    msgid = message.messageid 

                if(state == 1)
                    Time = formatTime(new Date(date))
                else
                    Time = formatAMPM(new Date())

                var changecolor = ""//doi mau the span edit
                var showeditmsg = ""//nhung js
                var oldcontent = ""//noi dung tin nhan moi

                if(message.edit.length > 0){//nếu tin nhắn được edit thì chạy hàm này
                    oldcontent = content
                    if(message.edit.length == 1){
                        content = message.edit[0].newcontent
                        changeclmisspell = calCheckmiss(message.edit[0].misspelling)
                        Time = formatTime(new Date(message.edit[0].time))
                    }else{
                        if(MYID == message.edit[0].whoedit){
                            content = message.edit[0].newcontent
                            Time = formatTime(new Date(message.edit[0].time))
                            changeclmisspell = calCheckmiss(message.edit[0].misspelling)
                        }else if(MYID == message.edit[1].whoedit){
                            content = message.edit[1].newcontent
                            changeclmisspell = calCheckmiss(message.edit[1].misspelling)
                            Time = formatTime(new Date(message.edit[1].time))
                        }
                    }  

                    changecolor = "color: green;";
                    var replacementJSON = replaceAll(JSON.stringify(message), '"', CONSTANTSTRING)
                    showeditmsg = '<span id="'+rid+'_infoeditmsg" style="margin-left: 3px;"'+
                        'class="glyphicon glyphicon glyphicon-eye-open" data-toggle="tooltip" title="show infor message"'+
                        ' onclick="showInfoEditMsg(event,\''+photo+'\',\''+replacementJSON+'\')"></span>'
        
                }

                var ischeckmisspelling = '<span id = "'+rid+'_check" class="glyphicon glyphicon-check" style="margin-left:3px;'+changeclmisspell+'" '+
                              'onclick="showMisspelling(event,'+rid+', '+id+','+state+',\''+content+'\')"></span>';
                if(sessionStorage.getItem("_checkmiss_"+id) == "true")
                    ischeckmisspelling = "";

                //du lieu van ban
                var messageType = ""
                if(message.content != null){
                    messageType = '<p id="'+rid+'_contentmsg">'+content+'</p>' +
                                '<input type="text" value="'+content+'" autofocus style="border:0px;outline-width:0;background:orange;display:none;" id="'+rid+'_fixcontmsg">' +
                                '<p><small>'+Time+'</small></p>' +
                                '<input type="hidden" id="'+rid+'_saveidms" value="'+msgid+'">'+
                                '<input type="hidden" id="'+rid+'_savecontentms" value="'+content+'">'+
                                '<a href="#">' +
                                    '<span id = "'+rid+'_speditmsg" class="glyphicon glyphicon-edit" style="'+changecolor+'" onclick="Editmessage(event,'+rid+',\''+content+'\')"></span>' + 
                                     showeditmsg+
                                     ischeckmisspelling+
                                    '<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;" onclick="Translate(event,'+rid+',\''+content+'\','+id+')"></span>' + 
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div class="translate" id="'+rid+'_trans" style="display:none;margin-top:2%;"></div>' +
                        '<div class="misspellings" style="display:none;margin-top:2%;" id="'+rid+'_missp"></div>'
                }else{
                    //du lieu khac
                    messageType =  '<p style="font-size:90%;">Audio</p>' +
                               '<div style="background-color:blue;"><audio style="width:100%;" controls id="'+rid+'_audio" src='+message.data+'></audio></div>'+
                               '<p><small>'+Time+'</small></p>'
                }


				var control = '<li style="width:100%;margin-top:2%;">' +
                        '<div class="msj macro">' +
                            '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+photo+'" /></div>' +
                            '<div class="text text-l">' +
                            messageType+
                    '</li>'+
                    '<div style="font-size:80%;display:none;" class="'+id+'_seen">seen at '+Time+'</div>';  

				document.getElementById(id+"_content").innerHTML +=  control;

                if(state == 0 && message.content != null)
				    Misspelling(rid, content, null);

				document.getElementById(id+"_scrollmsg").scrollTop = document.getElementById(id+"_scrollmsg").scrollHeight
			}

            //nhan tin nhan
			function Message_receiver(id, date, photo, message, state)
			{
				var rid = parseInt(makerandomid())
                var content  = message.content
                var Time, msgid = "";

                if(message.messageid)
                    msgid = message.messageid 

                if(state == 1)//hien thi thoi gian khi load tin nhan
                    Time = formatTime(new Date(date))
                else          //hien thi thoi gian khi dang nhan tin socket
                    Time = formatAMPM(new Date())

               //thay doi mau sac cua thanh check loi chinh ta
                var changeclmisspell = calCheckmiss(message.misspelling)//tinh toan gia tri
                var changecolor = ""//doi mau the span edit
                var showeditmsg = ""//nhung js
                var oldcontent = ""//noi dung tin nhan moi
                if(message.edit.length > 0){
                    oldcontent = content
                    if(message.edit.length == 1){
                        content = message.edit[0].newcontent
                        Time = formatTime(new Date(message.edit[0].time))
                        changeclmisspell = calCheckmiss(message.edit[0].misspelling)
                    }else{
                        if(MYID == message.edit[0].whoedit){
                           content = message.edit[0].newcontent
                           Time = formatTime(new Date(message.edit[0].time))
                           changeclmisspell = calCheckmiss(message.edit[0].misspelling)
                        }else if(MYID == message.edit[1].whoedit){
                            content = message.edit[1].newcontent
                            Time = formatTime(new Date(message.edit[1].time))
                            changeclmisspell = calCheckmiss(message.edit[1].misspelling)
                        }
                    }  

                    //vi khong the truyen 1 JSON.stringfify(do co chua dau ngoac kep " trong chuoi) do do
                    //can thay the chuoi nay bang 1 chuoi moi co CONSTANTSTRING la 1 day so khong bao gio 
                    //gap noi dau /"/ trong chuoi sau khi truyen thi thay the lai sau do chuyen sang object
                    var replacementJSON = replaceAll(JSON.stringify(message), '"', CONSTANTSTRING)

                    changecolor = "color: green;";
                    showeditmsg = '<span id = "'+rid+'_infoeditmsg" style="margin-left: 3px;"'+
                        'class="glyphicon glyphicon glyphicon-eye-open" data-toggle="tooltip" title="show infor message"'+
                        ' onclick="showInfoEditMsg(event,\''+photo+'\',\''+replacementJSON+'\')"></span>'

                }

                var ischeckmisspelling = '<span id = "'+rid+'_check" class="glyphicon glyphicon-check" style="margin-left:3px;'+changeclmisspell+'" '+
                       'onclick="showMisspelling(event,'+rid+', '+id+','+state+',\''+content+'\')"></span>';
                if(sessionStorage.getItem("_checkmiss_"+id) == "true")
                    ischeckmisspelling = "";

                var messageType = ""

                if(message.content != null){
                    messageType = '<p id="'+rid+'_contentmsg">'+content+'</p>' +
                                '<input id="'+rid+'_fixcontmsg" type="text" value="'+content+'" autofocus style="border:0px;background:orange;outline-width:0;display:none;">'+
                                '<p><small>'+Time+'</small></p>' +
                                '<input type="hidden" id="'+rid+'_saveidms" value="'+msgid+'">'+//luu id message de sau nay edit no
                                '<input type="hidden" id="'+rid+'_savecontentms" value="'+content+'">'+//luu gia tri edit
                                '<a href="#">' +
                                    '<span id = "'+rid+'_speditmsg" class="glyphicon glyphicon-edit" style="'+changecolor+'" onclick="Editmessage(event,'+rid+',\''+content+'\')"></span>' + 
                                    showeditmsg +
                                    ischeckmisspelling+
                                    '<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;" onclick="Translate(event,'+rid+',\''+content+'\','+id+')"></span>' +
                                '</a>'
                }else{
                    messageType =  '<p style="font-size:90%;">Audio</p>' +
                           '<div style="background-color:blue;height:auto;margin-top:3%;">'+
                           '<audio style="width:100%;" type="audio/webm" id="'+rid+'_audio" controls src='+message.data+'></audio></div>'+
                            '<p><small>'+Time+'</small></p>'

                }


				var control = '<li style="width:100%;margin-top:2%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                messageType+
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+photo+'"/></div>' +
                  '</li>' +
				  '<li style="width:100%;"><div class="translate" style="float:right;display:none;" id="'+rid+'_trans"></div>' +
				  '<div class="misspellings" style="float:right;display:none;" id="'+rid+'_missp"></div></li>';


				document.getElementById(id+"_content").innerHTML += control;
				//add setting condition

                if(state == 0 &&  message.content != null)
				    Misspelling(rid, content, null);

				document.getElementById(id+"_scrollmsg").scrollTop = document.getElementById(id+"_scrollmsg").scrollHeight
			}


			var TIME_TRANSLATE = 5000, TIME_MISSPE = 5000
			function Translate(e, id, content, boxid)
			{
				if(e) e.preventDefault()
				var showtranslatep = document.getElementById(id+"_trans")
                var realcontent = document.getElementById(id+"_savecontentms")
         
				if(showtranslatep.innerHTML == ""){

					Translate_or_Misspelling("/languageex/user/translate", 
				  		MYPRIOEX, MYPRIONAT, realcontent.value, function(data){
				  		if(data.content.error == null){
                            if(data.content.from == MYPRIOEX)
				  			   showtranslatep.innerHTML = "trans: <span style='color:blue;'>"+data.content.translated+"</span>"
                            else{
                                showtranslatep.innerHTML = "trans: <span style='color:blue;'>"+data.content.translated+". </span>"+
                                                            "(from "+data.content.from+ " to " + MYPRIONAT + ")"
                            }
				  		}else
				  			showtranslatep.innerHTML = "somes error with your msg. Error translate."
				  		
				  		showtranslatep.style.display = "block"
						setTimeout(function(){
							showtranslatep.style.display = "none"
						}, TIME_TRANSLATE)
					})

				}else{
					showtranslatep.style.display = "block"
					setTimeout(function(){
						showtranslatep.style.display = "none"
					}, TIME_TRANSLATE)
				}

				//document.getElementById(boxid+"_scrollmsg").scrollTop = document.getElementById(boxid+"_scrollmsg").scrollHeight
			}
			
         //check loi chinh ta
			function Misspelling(id, content, cb)
			{
				var showcheckedmis = document.getElementById(id+"_missp")
                var realcontent = document.getElementById(id+"_savecontentms")
				if(showcheckedmis.innerHTML == "")
				{
					Translate_or_Misspelling("/languageex/user/checkmisspelling", 
						MYPRIOEX , null, realcontent.value, function(data){

	                    if(typeof cb == "function")
                            cb(data);//tra ve du lieu

						if(data.content.error == null){
							if(data.content.value == ""){
								if(data.content.language == MYPRIOEX)
                                    showcheckedmis.innerHTML = "your message ok."
                                else
                                    showcheckedmis.innerHTML = "your message ok. But not your exchange language."
                                document.getElementById(id+"_check").style.color = "#337ab7"
							}else{
								if(data.content.language == MYPRIOEX){
									showcheckedmis.innerHTML = "Did you mean: " + matchMisspelling(realcontent.value, data.content.value)
									document.getElementById(id+"_check").style.color = "red"
								}
								else{
									showcheckedmis.innerHTML = "Detected language: " + data.content.language +"(symbol)"
									document.getElementById(id+"_check").style.color = "yellow"
								}
							}
						}else
							showcheckedmis.innerHTML = "Not match with your language.  Error misspelling."
					})
				}
			}

            //event show misspelling
			function showMisspelling(e, id, boxid, state, content)
            {
				    if(e) e.preventDefault()
                var showcheckedmis = document.getElementById(id+"_missp")
                if(state == 0){
				    showcheckedmis.style.display = "block"

                    setTimeout(function(){
                        showcheckedmis.style.display = "none"
                    }, TIME_MISSPE)
                }else{
                    if(showcheckedmis.innerHTML == ""){
                        Misspelling(id, content, function(data){
                            var showcheckedmis = document.getElementById(id+"_missp")
                            showcheckedmis.style.display = "block"

                            setTimeout(function(){
                                showcheckedmis.style.display = "none"
                            }, TIME_MISSPE)
                        })
                    }else{
                        showcheckedmis.style.display = "block"

                        setTimeout(function(){
                            showcheckedmis.style.display = "none"
                        }, TIME_MISSPE)
                    }
                    
                }

			//	document.getElementById(boxid+"_scrollmsg").scrollTop = document.getElementById(boxid+"_scrollmsg").scrollHeight
			}
			
			//ham sua tin nhan
			function Editmessage(e, id, content){
				if(e) e.preventDefault()
				var span_edit = document.getElementById(id+"_speditmsg")
				var p_content = document.getElementById(id+"_contentmsg")
				var input_fix_content = document.getElementById(id+"_fixcontmsg")
				var input_fix_old_content = input_fix_content.value
                var hiddent_content_msg = document.getElementById(id+"_savecontentms")

				p_content.style.display = "none"
				input_fix_content.style.display = "block"
				
				//dat con tro o cuoi the input
				setCaretPosition(input_fix_content, input_fix_content.value.length);

				input_fix_content.addEventListener("keypress", function(e){

					if(e.keyCode == 13){
						var content = input_fix_content.value
						if(content.length < 1)
							alert("You can not blank this fields")
						else if(input_fix_old_content != content)
						{
							var msgid =  document.getElementById(id+"_saveidms").value
							//ajax with else condition
							editMessage(msgid, content, function(data){
								p_content.style.display = "block"
								span_edit.style.color = "green"
								p_content.innerHTML = content
								input_fix_content.style.display = "none"
                                hiddent_content_msg.value = content//update new value

                                var showtranslatep = document.getElementById(id+"_trans")
                                showtranslatep.innerHTML = ""//reset value translate before

                                var showcheckedmis = document.getElementById(id+"_missp")//reset value checkmiss
                                showcheckedmis.innerHTML = ""

                                if(sessionStorage.getItem("_checkmiss_"+id) == "false"){ //check lai loi chinh ta
                                    Misspelling(id, content, null);
                                }

                                SCORING = 1;
                                REQUEST_AJAX_SERVER('/languageex/user/score', 'POST', {score: SCORING}, 
                                function(err, data){
                                    if(err) alert(err)
                                })
                               
								//console.log(data)
                             //   socket.emit('editmsg', {myid:MYID, pid: })
							})
						}
					}
				})

			}

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

            //gui du lieu len server sua tin nhan
			var editMessage = function(msgid, content, cb){
            	$.ajax({
                    type: "POST",
                    url: "/languageex/user/editmsg",
                    data:{id: msgid, whoedit: MYID, content: content, myex: MYPRIOEX},
                    success: function(data)//hien thi message
                    {
                        if(typeof cb == "function")
                       		cb(JSON.parse(data));//tra ve du lieu
                    }
                  })
            }

            //ham set vi tri cua con tro khi thay doi gia tri trong input
            function setCaretPosition(ctrl, pos) {
  				// Modern browsers
  				if (ctrl.setSelectionRange) {
   				 	ctrl.focus();
    			 	ctrl.setSelectionRange(pos, pos);
  
  				// IE8 and below
  				} else if (ctrl.createTextRange) {
    				var range = ctrl.createTextRange();
    				range.collapse(true);
    				range.moveEnd('character', pos);
    				range.moveStart('character', pos);
    				range.select();
  				}		
			}


            //hien thi thong tin edit message
            function showInfoEditMsg(e, photo, message)//hien thi thong tin tin nhan da edit
            {
                if(e) e.preventDefault()

                var messagetoOBJ = replaceAll(message, CONSTANTSTRING, '"')
                message = JSON.parse(messagetoOBJ)

                $('#InformationEditMessage').modal('show')
                var modalEditMessage = document.getElementById('InformationEditMessage')
                var modalEditMessage_body = modalEditMessage.getElementsByClassName('modal-body')[0]

                var oldcontent = ""
                if(message.userA == MYID)
                    var oldcontent = '<tr><td>Me</td><td>'+message.content +' (old)</td><td>'+getDateTime(new Date(message.time))+'</td><td>none</td></tr>'
                else{
                    var oldcontent = '<tr><td><image src='+photo+' class="img-circle" height="35" width="35" alt="Avatar"></td><td>'+message.content +' (old)</td><td>'+
                       getDateTime(new Date(message.time))+'</td><td>none</td></tr>'
                }

                var anotheredit = ""
                if(message.edit.length == 1){
                    if(message.edit[0].whoedit != MYID)
                       anotheredit = '<tr><td><image src='+message.edit[0].id+' class="img-circle" height="35" width="35" alt="Avatar"></td><td>'+message.edit[0].newcontent+' (new)</td><td>'+getDateTime(new Date(message.edit[0].time))+'</td><td><input type="checkbox" checked disabled></td></tr>' 
                }else{//length = 2
                    if(message.edit[0].whoedit != MYID)
                       anotheredit = '<tr><td><image src='+message.edit[0].id+' class="img-circle" height="35" width="35" alt="Avatar"></td><td>'+message.edit[0].newcontent+' (new)</td><td>'+getDateTime(new Date(message.edit[0].time))+'</td><td><input type="checkbox" checked disabled></td></tr>' 
                    else if(message.edit[1].whoedit != MYID)
                        anotheredit = '<tr><td><image src='+message.edit[0].id+' class="img-circle" height="35" width="35" alt="Avatar"></td><td>'+message.edit[1].newcontent+' (new)</td><td>'+getDateTime(new Date(message.edit[1].time))+'</td><td><input type="checkbox" checked disabled></td></tr>' 
                }

                var ele = '<table class="table table-hover"><thead><tr>'+
                          '<th>photo</th><th>content</th><th>time</th><th>Agree</th>'+
                          '</tr></thead>'+
                          '<tbody>' +
                                oldcontent+
                                anotheredit+
                          '</tbody>' +
                          '</table>'

                modalEditMessage_body.innerHTML = ele
            }