//this function can remove a array element.
            Array.remove = function(array, from, to) {
                var rest = array.slice((to || from) + 1 || array.length);
                array.length = from < 0 ? array.length + from : from;
                return array.push.apply(array, rest);
            };
			
			
			var me = {};
			me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

			var you = {};
			you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";
        
            //this variable represents the total number of popups can be displayed according to the viewport width
            var total_popups = 0;
            
            //arrays of popups ids
            var popups = [];
			
			function formatAMPM(date) {
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
                for(var iii = 0; iii < popups.length; iii++)
                {
                    if(id == popups[iii])
                    {
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
            
            //creates markup for a new popup. Adds the id to popups array.
            function register_popup(id, name)
            {
                
                for(var iii = 0; iii < popups.length; iii++)
                {   
                    //already registered. Bring it to front.
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);
                    
                        popups.unshift(id);
                        
                        calculate_popups();
                        
                        return;
                    }
                }               
                
                document.getElementsByTagName("nav")[0].innerHTML += Show_pop_up_message(id, name);  
				$('#content_message').scrollTop($('#content_message')[0].scrollHeight);
                popups.unshift(id);
                calculate_popups();
				
            }
			
			var count = 0;
			function Click(e, id)
			{	  
	          if(e.keyCode == 13){
				  count++;
				  val = document.getElementById(id+"ee").value;
				  if(count%2==0)
					Message_send(id, val)
				  else
					Message_receiver(id, val)  
				  document.getElementById(id+"ee").value = "";
			  }
            }
            
            //calculate the total number of popups suitable and then populate the toatal_popups variable.
            function calculate_popups()
            {
                var width = window.innerWidth;
                if(width < 540)
                {
                    total_popups = 0;
                }
                else
                {
                    width = width - 200;
                    //320 is width of a single popup box
                    total_popups = parseInt(width/320);
                }
                display_popups();
                
            }
            
            //recalculate when window is loaded and also when window is resized.
            window.addEventListener("resize", calculate_popups);
            window.addEventListener("load", calculate_popups);
			
			
			
			function Show_pop_up_message(id, name)
			{
				var element = '<div class="popup-box-chat" id="'+ id +'">' + 
									'<div style="background-color:  #5b5bef;height: 10%;">' + 
                                        '<div style="height:100%;display:table;float:left;width:70%;">' + 
				                            '<p style="font-size:110%;color:black;margin-left:6%;margin-top:4%;">' +
                                               '<b><i>'+ name +'</i></b>' +
											 '</p>' +
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
   															'<li><a href="/exlanguage/messenger?uid='+id+'">Open in messenger</a></li>' + 
														   '<li><div class="checkbox" style="margin-left:10%;">' +
      																'<label><input type="checkbox" value="" > Block message</label>'+
   															   '</div></li>' +
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
				
                                    '<div style="height:80%;width:100%;background-color:#CCCCCC;overflow:auto;" id="content_message">' + //#bcd1c6
                                       '<div><ul id="'+name+'" class="ulclass"></ul></div>' + //content message
									   
										'<div style="background-color:#CCCCCC;z-index:1;">' +
									      '<img src="'+me.avatar+'" class="img-rounded" alt="Anh dai dien" width="40" height="40" style="margin-top:-1%;">' + 
										  '<span>.....</span>' + 
										  '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>' + 
										  '<span>.....</span>' + 
								        '</div>' +
										
                                    '</div>' +
							
                                    '<div style="margin-top:5px;box-shadow: 1px 2px 5px #ccccff;height: 10%;">' + 
                                          '<input type = "text" placeholder= "Viết tin nhắn..." id = "'+name+'ee" style="width:85%;height:88%;border:0px;outline-width:0;" autofocus onkeypress="Click(event,\''+name+'\')">' + 
				                          '<a style = "margin-left: 2px;"><i class="fa fa-microphone" style="font-size:20px"></i></a>' + 
				                          '<a style = "margin-left: 5px;"><i class="fa fa-video-camera" style="font-size:22px"></i></a>' + 
                                          '<div style="clear: both;"></div>'
									'</div>';
				
                               '</div>'; // end
				
				return element;
				
			}
			
			function Message_send(id, content)
			{
				var date = formatAMPM(new Date());

				var control = '<li style="width:100%;margin-top:2%;">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ me.avatar +'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ content +'</p>' +
								'<input type="text" value="'+content+'" autofocus style="border:0px;outline-width:0;display:none;">' +
                                '<p><small>'+date+'</small></p>' +
								'<a href="#">' +
									'<span class="glyphicon glyphicon-edit" ></span>' + 
									'<span class="glyphicon glyphicon-check" style="margin-left: 3px;"></span>' + 
									'<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;"></span>' + 
								'</a>' +
                            '</div>' +
                        '</div>' +
						
						'<div class="translate">translate</div>' +
						'<div class="translate misspellings">misspellings</div>' +
                    '</li>';   
				
				document.getElementById(id).innerHTML +=  control;	
				
				$('#content_message').scrollTop($('#content_message')[0].scrollHeight);
			}
			
			function Message_receiver(id, content)
			{
				var date = formatAMPM(new Date());
				
				var control = '<li style="width:100%;margin-top:2%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+content+'</p>' +
								'<input type="text" value="'+content+'" autofocus style="border:0px;outline-width:0;display:none;">'+
                                '<p><small>'+date+'</small></p>' +
								'<a href="#">' +
									'<span class="glyphicon glyphicon-edit" ></span>' + 
									'<span class="glyphicon glyphicon-check" style="margin-left: 3px;"></span>' + 
									'<span class="glyphicon glyphicon-transfer" style="margin-left: 3px;" onclick="Translate(\''+content+'\');"></span>' +
								'</a>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+you.avatar+'" /></div>' +
                  '</li>' +
				  '<li style="width:100%;"><div class="translate" style="float:right;">translate</div>' +
				  '<div class="translate misspellings" style="float:right;">misspellings</div></li>';
				
				document.getElementById(id).innerHTML += control;
				
				$('#content_message').scrollTop($('#content_message')[0].scrollHeight);
			}
			
			function Translate(content){
				alert(content)
			}
			
			function Misspelling(content){
				alert(content)
			}
			
			function Editmessage(content){
				alert(content)
			}