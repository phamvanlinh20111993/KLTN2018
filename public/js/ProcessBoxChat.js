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
            function register_popup(id, name, photo)
            {
          
                socket.emit('createroomchat', {myid: MYID, partnerid: id})

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
                takeSettingMessage(id, function(content){
                	takecontentMessage(id, function(setting){
               			document.getElementsByTagName("nav")[0].innerHTML += 
               				Show_pop_up_message(id, name, photo, setting);  
						document.getElementById(id+"_scrollmsg").scrollTop = 
							document.getElementById(id+"_scrollmsg").scrollHeight

						popups.unshift(id);
                        calculate_popups();
						//show data to user

                	})
                })

            }
			
			function Click(e, id, photo)
			{	  
	          	if(e.keyCode == 13){
	          		var time = formatAMPM(new Date());
					var val = document.getElementById(id + "_mymsg").value;

					if(val.length > 0){
						Message_send(id, time, MYPHOTO, val)
						socket.emit('sendmsg', {
							content: val,
							time: new Date(),
                        	myid: MYID,
                        	photo: MYPHOTO,
                        	pid: id
						}) 
						document.getElementById(id + "_mymsg").value = "";

						socket.emit('checkmisspellings', {
							content: val,
            				nat: MYPRIONAT,
            				ex: MYPRIOEX,
            				id: MYID,
            				senderid: id
						})

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

            	 	Message_receiver(data.id_send, time, data.myphoto, data.content)
            	    document.getElementById(data.id_send+"_typing").style.display = "none"
            		
          			$('#'+data.id_send+'_mymsg').on("focus", function(){
          				if($(this).is(':focus')){
          					socket.emit('isseemsg', { myid: MYID, pid: data.id_send })
          				}
          			})

            		socket.emit('checkmisspellings', {
            			content: data.content,
            			nat: MYPRIONAT,
            			ex: MYPRIOEX,
            			id: MYID,
            			senderid: data.id_send
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
      																'<label><input type="checkbox" value="" checked> Auto misspellings</label>'+
   															   '</div></li>' + 
   															'<li><a href="/languageex/messenger?uid='+id+'">Open in messenger</a></li>' + 
														   '<li><div class="checkbox" style="margin-left:10%;">' +
      																'<label><input type="checkbox" value="" > Block messages</label>'+
   															   '</div></li>' +
   															'<li><a href="#">Translations priority</a></li>' + 
   															'<li><a href="#">Misspellings priority</a></li>' + 
														   '<li><a href="#">Delete Conversation</a></li>' + 
														   '<li><a href="#">Report <span style="color:orange;">'+name+'</span></a></li>' +
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
                                            ' style="width:85%;height:88%;border:0px;outline-width:0;" autofocus onkeypress="Click(event,\''+id+'\')">'+ 
				                          '<a style = "margin-left: 2px;"><i class="fa fa-microphone" style="font-size:20px"></i></a>' + 
				                          '<a style = "margin-left: 5px;"><i class="fa fa-video-camera" style="font-size:22px"></i></a>' + 
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


			function Message_send(id, date, photo, content)
			{
				var rid = parseInt(makerandomid())
	
				var control = '<li style="width:100%;margin-top:2%;" class="'+id+'_msgserc">' +
                        '<div class="msj macro">' +
                            '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+photo+'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ content +'</p>' +
								'<input type="text" value="'+content+'" autofocus style="border:0px;outline-width:0;display:none;">' +
                                '<p><small>'+date+'</small></p>' +
								'<a href="#">' +
									'<span class="glyphicon glyphicon-edit" onclick="Editmessage(\''+content+'\')"></span>' + 
									'<span class="glyphicon glyphicon-check" style="margin-left: 3px;" onclick="Misspelling(event,'+id+')"></span>' + 
									'<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;" onclick="Translate(event,'+rid+',\''+content+'\')"></span>' + 
								'</a>' +
                            '</div>' +
                        '</div>' +
						
						'<div class="translate" style="display:none;" id="'+rid+'">translate</div>' +
						'<div class="translate misspellings" style="display:none;">misspelling</div>' +
                    '</li>'+
                    '<div style="font-size:80%;display:none;" class="'+id+'_seen">seen at '+formatAMPM(new Date())+'</div>';    
				document.getElementById(id+"_content").innerHTML +=  control;

				document.getElementById(id+"_scrollmsg").scrollTop = document.getElementById(id+"_scrollmsg").scrollHeight
			}


			function Message_receiver(id, date, photo, content)
			{
				var rid = parseInt(makerandomid())

				var control = '<li style="width:100%;margin-top:2%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+content+'</p>' +
								'<input type="text" value="'+content+'" autofocus style="border:0px;outline-width:0;display:none;">'+
                                '<p><small>'+date+'</small></p>' +
								'<a href="#">' +
									'<span class="glyphicon glyphicon-edit" onclick="Editmessage(\''+content+'\')"></span>' + 
									'<span class="glyphicon glyphicon-check" style="margin-left: 3px;" onclick="Misspelling(event,'+id+')"></span>' + 
									'<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;" onclick="Translate(event,'+rid+',\''+content+'\')"></span>' +
								'</a>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+photo+'"/></div>' +
                  '</li>' +
				  '<li style="width:100%;" class="'+id+'_msgserc"><div class="translate" style="float:right;display:none;" id="'+rid+'">translate</div>' +
				  '<div class="translate misspellings" style="float:right;display:none;">misspellings</div></li>';

				
				document.getElementById(id+"_content").innerHTML += control;
				document.getElementById(id+"_scrollmsg").scrollTop = document.getElementById(id+"_scrollmsg").scrollHeight
			}


			socket.on('checkeddone', function(data){
				var showcheckedmis = document.getElementsByClassName(data.sid + "_msgserc")
				if(showcheckedmis.length > 0){
					var showcontent = showcheckedmis[showcheckedmis.length-1].getElementsByClassName("misspellings")
					showcontent[0].innerHTML = data.value
					console.log(data)
				}
			})


			var TIME_TRANSLATE = 5000, TIME_MISSPE = 7000
			function Translate(e, id, content){
				e.preventDefault()
				var showtranslatep = document.getElementById(id)
				showtranslatep.style.display = "block"

				socket.emit('translate', {
					id: MYID,
					ex: MYPRIOEX, 
					nat: MYPRIONAT,
					content:content,
					eid: id//id (ben giao dien)cua message da gui len
				})

				setTimeout(function(){
					showtranslatep.style.display = "none"
				}, TIME_TRANSLATE)
			}
			

			socket.on('translateddone', function(data){
				var showtranslatep = document.getElementById(data.eid)
				if(data.error == null)
					showtranslatep.innerHTML = "trans: <span style='color:blue'>" + data.translated+"</span>"
				else
					showtranslatep.innerHTML = "trans: " + data.error
			})


			function Misspelling(e, id){
				e.preventDefault()
				var showcheckedmis = document.getElementsByClassName(id + "_msgserc")
				console.log("toi da chay " + showcheckedmis.length + "  " + id)
				if(showcheckedmis.length > 0){
					var showcontent = showcheckedmis[showcheckedmis.length-1].getElementsByClassName("misspellings")
					console.log("toi da chay id " + id)
					showcontent[0].style.display = "block"

					setTimeout(function(){
						showcontent[0].style.display = "none"
					}, TIME_MISSPE)
				}
			}
			

			function Editmessage(content){
				//this.style.color = "red"
				alert(content)
			}