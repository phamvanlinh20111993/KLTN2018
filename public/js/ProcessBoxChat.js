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
                var hours = date.getHours();
                var minutes = date.getMinutes();

                var days = date.getDay();
                var months = date.getMonth();
                var years = date.getFullYear();

                minutes = minutes < 10 ? '0'+ minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + days + '/' + months;

                if((new Date()).getFullYear() != years)
                    strTime = days + '/' + months + '/' +years

                return strTime;
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

            
            //creates markup for a new popup. Adds the id to popups array.
            function register_popup(event, id, name, photo)
            {
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
                    if(setting.settingmsg.length > 0){//co ton tai setting
                        sessionStorage.setItem("_block_"+id, true);
                    }else
                        sessionStorage.setItem("_block_"+id, false);
                    
                	takecontentMessage(id, function(content)
                    {
               			document.getElementsByTagName("nav")[0].innerHTML += 
               				Show_pop_up_message(id, name, photo, setting); 
                        var myMessages = {}

                        console.log(content)
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
                            if(sessionStorage.getItem("_block_"+id) == true){
                                document.getElementById(id + "_mymsg").disabled = true;
                                alert("You was blocked messages by " + name)
                            }
                        }

						document.getElementById(id+"_scrollmsg").scrollTop = 
							document.getElementById(id+"_scrollmsg").scrollHeight

						popups.unshift(id);
                        calculate_popups();
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
						socket.emit('sendmsg', {
							content: message,
							time: new Date(),
                        	myid: MYID,
                        	photo: MYPHOTO,
                        	pid: id
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
				var misspellings = ""
				var blockmsg = ""
                var checkblockmsg = ""

                if(typeof sessionStorage.getItem("_block_"+id) !='undefined')
                    if(typeof sessionStorage.getItem("_block_"+id))
                        checkblockmsg = "checked"

				var element = '<div class="popup-box-chat" id="'+ id +'">' + 
									'<div style="background-color:  #5b5bef;height: 10%;">' + 
                                        '<div style="height:100%;display:table;float:left;width:70%;">' + 
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
													       '<li> <div class="checkbox" style="margin-left:10%;">' +
      																'<label><input type="checkbox" value="" checked onclick="Auto_check_miss(this,'+id+')"> Auto misspellings</label>'+
   															   '</div></li>' + 
   															'<li><a href="/languageex/messenger?uid='+id+'">Open in messenger</a></li>' + 
														   '<li><div class="checkbox" style="margin-left:10%;">' +
      																'<label><input type="checkbox" value="" onclick="Blockmessages(this,'+id+',\''+name+'\')" '+checkblockmsg+'> Block messages</label>'+
   															   '</div></li>' +
   															'<li><a href="#" onclick="translatePrio()">Translations priority</a></li>' + 
   															'<li><a href="#" onclick="misspellingPrio()">Misspellings priority</a></li>' + 
														   '<li><a href="#" onclick="delConversation('+id+',\''+name+'\')">Delete Conversation</a></li>' + 
														   '<li><a href="#" onclick="reportUser('+id+',\''+name+'\' )">Report <span style="color:orange;">'+name+'</span></a></li>' +
														'</ul>' + 
				                                   '</div>' + 
											 '</div>' + 
											 
				                             '<div style="float:right;width:50%;margin-top:4%;">' + 
											      '<button class="close1 close2" onclick="close_popup(\''+id+'\')">X</button>' + 
											 '</div>' + 
											 
                                        '</div>' + 
								    '</div>' + 
				
                                    '<div style="height:80%;width:100%;background-color:#CCCCCC;overflow:auto;" id="'+id+'_scrollmsg">' + //#bcd1c6
                                       '<div style="text-align: center; margin-top:3%;">Welcome to talk with <span style="color: red;">'+ name +'</span></div>'+
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
				                          '<a style = "margin-left: 5px;"><i class="fa fa-video-camera" style="font-size:22px" onclick="callVideoOneToOne(\''+id+'\')"></i></a>' + 
                                          '<div style="clear: both;"></div>'
									'</div>';
				
                               '</div>'; // end
				
				return element;
				
			}
			

			function makerandomid(){
    			var text = "";
    			var possible = "0123456789";

    			for( var i = 0; i < 20; i++ )//ma xac thuc co ngau nhien 45 ki tu
        			text += possible.charAt(Math.floor(Math.random() * possible.length));
    			return text;
			}

            //bien state de check la day la load tin nhan tu server hay nguoi dung dang nhan tin
			function Message_send(id, date, photo, message, state)
			{
				var rid = parseInt(makerandomid())
	            var content  = message.content
                var Time;
                if(state == 1)
                    Time = formatTime(new Date(date))
                else
                    Time = formatAMPM(new Date())

                //du lieu van ban
                var messageType = ""
                if(message.content != null){
                    messageType = '<p id="'+rid+'_contentmsg">'+content+'</p>' +
                                '<input type="text" value="'+content+'" autofocus style="border:0px;outline-width:0;background:orange;display:none;" id="'+rid+'_fixcontmsg">' +
                                '<p><small>'+Time+'</small></p>' +
                                '<input type="hidden" id="'+rid+'_saveidms" value="">'+
                                '<a href="#">' +
                                    '<span id = "'+rid+'_speditmsg" class="glyphicon glyphicon-edit" onclick="Editmessage(event,'+rid+',\''+content+'\')"></span>' + 
                                    '<span id = "'+rid+'_check" class="glyphicon glyphicon-check" style="margin-left: 3px;" onclick="showMisspelling(event,'+rid+', '+id+','+state+',\''+content+'\')"></span>' + 
                                    '<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;" onclick="Translate(event,'+rid+',\''+content+'\','+id+')"></span>' + 
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div class="translate" id="'+rid+'_trans" style="display:none;margin-top:2%;"></div>' +
                        '<div class="misspellings" style="display:none;margin-top:2%;" id="'+rid+'_missp"></div>'
                }else{
                    //du lieu khac
                    messageType =  '<p style="font-size:90%;">Audio</p>' +
                               '<div style="background-color:blue;"><audio style="width:100%;" controls src='+message.data+'></audio></div>'+
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
                var Time;
                if(state == 1)
                    Time = formatTime(new Date(date))
                else
                    Time = formatAMPM(new Date())
                 

                var messageType = ""

                if(message.content != null){
                    messageType = '<p id="'+rid+'_contentmsg">'+content+'</p>' +
                                '<input id="'+rid+'_fixcontmsg" type="text" value="'+content+'" autofocus style="border:0px;background:orange;outline-width:0;display:none;">'+
                                '<p><small>'+Time+'</small></p>' +
                                '<input type="hidden" id="'+rid+'_saveidms" value="">'+//luu id message de sau nay edit no
                                '<a href="#">' +
                                    '<span id = "'+rid+'_speditmsg" class="glyphicon glyphicon-edit" onclick="Editmessage(event,'+rid+',\''+content+'\')"></span>' + 
                                    '<span id = "'+rid+'_check" class="glyphicon glyphicon-check" style="margin-left:3px;" onclick="showMisspelling(event,'+rid+', '+id+','+state+',\''+content+'\')"></span>' + 
                                    '<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;" onclick="Translate(event,'+rid+',\''+content+'\','+id+')"></span>' +
                                '</a>'
                }else{
                    messageType =  '<p style="font-size:90%;">Audio</p>' +
                           '<div style="background-color:blue;height:auto;margin-top:3%;"><audio style="width:100%;" src='+message.data+' controls></audio></div>'+
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
				e.preventDefault()
				var showtranslatep = document.getElementById(id+"_trans")

				if(showtranslatep.innerHTML == ""){
					Translate_or_Misspelling("/languageex/user/translate", 
				  		MYPRIOEX, MYPRIONAT, content, function(data){
				  	
				  		if(data.content.error == null){
				  			showtranslatep.innerHTML = "trans:  <span style='color:blue;'>"+data.content.translated+"</span>"
				  		}else
				  			showtranslatep.innerHTML = "somes error with your msg."
				  		
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
			

			function Misspelling(id, content, cb)
			{
				var showcheckedmis = document.getElementById(id+"_missp")
				if(showcheckedmis.innerHTML == "")
				{
					Translate_or_Misspelling("/languageex/user/checkmisspelling", 
						MYPRIOEX , null, content, function(data){

	                    if(typeof cb == "function")
                            cb("Done.");//tra ve du lieu

						if(data.content.error == null){
							if(data.content.value == ""){
								showcheckedmis.innerHTML = "your message ok."
							}else{
								if(data.content.language == MYPRIOEX){
									showcheckedmis.innerHTML = "Did you mean: " + data.content.value
									document.getElementById(id+"_check").style.color = "red"
								}
								else{
									showcheckedmis.innerHTML = "Not valid this: " + data.content.value
									document.getElementById(id+"_check").style.color = "yellow"
								}
							}
						}else
							showcheckedmis.innerHTML = "not match with your language."
					})
				}
			}

            //event show misspelling
			function showMisspelling(e, id, boxid, state, content)
            {
				e.preventDefault()
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
				e.preventDefault()
				var span_edit = document.getElementById(id+"_speditmsg")
				var p_content = document.getElementById(id+"_contentmsg")
				var input_fix_content = document.getElementById(id+"_fixcontmsg")
				var input_fix_old_content = input_fix_content.value

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
							msgid = "2133213123" //get message id
							//ajax with else condition
							editMessage(msgid, content, function(data){
								p_content.style.display = "block"
								span_edit.style.color = "green"
								p_content.innerHTML = content
								input_fix_content.style.display = "none"
								console.log(data)
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
                    data:{id: msgid, whoedit: MYID, content: content},
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