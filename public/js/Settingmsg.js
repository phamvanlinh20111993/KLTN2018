
var _CHECKBOXTRANS = 0, _CHECKBOXMISS = 0;
var _CHECKBOXREPORT = []


var selectAllmyNative_Exchange = function(url, id, cb){
	$.ajax({
        type: "POST",
        url: url,
        data:{id: id},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
                cb(JSON.parse(data));//tra ve du lieu
        }
    })
}


var selectAllReport = function(cb){
	$.ajax({
        type: "POST",
        url: "/languageex/user/allreport",
        data:{},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
                cb(JSON.parse(data));//tra ve du lieu
        }
    })
}


var changeTranslate_Misspelling = function(url, idlg, cb){
	$.ajax({
        type: "PUT",
        url: url,
        data:{idlg: idlg},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
                cb(JSON.parse(data));//tra ve du lieu
        }
    })
}


var choosereportUser = function(id, time, code, cb){//code is array
	$.ajax({
        type: "POST",
        url: "/languageex/user/report",
        data:{whid: MYID, rpw: id, time: time, code: code},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
                cb(JSON.parse(data));//tra ve du lieu
        }
    })
}


var choosedelConversation = function(idw, time, cb){
	$.ajax({
        type: "DELETE",
        url: "/languageex/user/delconversation",
        data:{id: idw, time: time},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
                cb(JSON.parse(data));//tra ve du lieu
        }
    })
}


//hien thi muc do uu tien cua ngon ngu nguoi dung, ngon ngu uu tien translate
var translatePrio = function()
{
	var modeltranslate = document.getElementById("TranslationpriorityHome")
	$('#TranslationpriorityHome').modal('show');
	var modeltranslate_title = modeltranslate.getElementsByClassName("modal-title")[0]
	var modeltranslate_body = modeltranslate.getElementsByClassName("modal-body")[0]

	console.log(modeltranslate_body.innerHTML.length)
	if(modeltranslate_body.innerHTML.length < 60){ // co title  <h4>My Native Language</h4>
		selectAllmyNative_Exchange("/languageex/user/allnat", MYID, function(data){
		
			var Ele = "", isdisable = "", note = "";

			if(data.allnat.length == 1){
				isdisable = "disabled"
				note = '<div class="alert alert-info">'+
 						'<strong>Info!</strong> Please add more your native language.'+
				 	'</div>'
			}

			for(var ind = 0; ind < data.allnat.length; ind ++){
				if(data.allnat[ind].prio == 1){
					Ele += '<div class="checkbox">'+
            		 '<label><input type="radio" value="'+data.allnat[ind].id+'" name="natlanguage" '+isdisable+' checked> '+
            	 			data.allnat[ind].natname+'</label>'+
         		 		'</div>'
				}else{
		 			Ele += '<div class="checkbox">'+
            	 		'<label><input type="radio" value="'+data.allnat[ind].id+'" id="'+data.allnat[ind].natsy+'" name="natlanguage"> '+
            	 			data.allnat[ind].natname+'</label>'+
         		 	'</div>'
         		}
			}

			Ele += note;
			modeltranslate_body.innerHTML = Ele

		})
	}

	var modeltranslate_footer = modeltranslate.getElementsByClassName("modal-footer")[0]
	var modeltranslate_footer_button = modeltranslate_footer.getElementsByTagName("button")[0]

	modeltranslate_footer_button.onclick = function()
	{
		var input_radio = modeltranslate_body.getElementsByTagName("input")
		if(input_radio.length > 1){
			var flag = false, natsy = "", value = "";
			for(var index = 0; index < input_radio.length; index++){
				if(input_radio[index].checked){
					flag = true;
					natsy = input_radio[index].id
					value = input_radio[index].value
					break;
				}
			}
		}

		if(flag && MYPRIONAT != natsy){

			changeTranslate_Misspelling("/languageex/user/changetrasprio", value, function(data){
				MYPRIONAT = natsy

				console.log(data)
			})
		}

		$('#TranslationpriorityHome').modal('hide');
	}

}

//check loi chinh ta
var misspellingPrio = function()
{
	var modelmisspelling = document.getElementById("MisspellingpriorityHome")
	$('#MisspellingpriorityHome').modal('show');
	var modelmisspelling_body = modelmisspelling.getElementsByClassName("modal-body")[0]
	var modelmisspelling_title = modelmisspelling.getElementsByClassName("modal-title")[0]

	if(modelmisspelling_body.innerHTML.length < 60){//co title <h4>My Exchange Language</h4>

		selectAllmyNative_Exchange("/languageex/user/allex", MYID, function(data){

			var Ele = "", isdisable = "", note = "";
			if(data.allex.length == 1){
				isdisable = "disabled"
				note = '<div class="alert alert-info">'+
 						'<strong>Info!</strong> Please add more your exchange language.'+
				 	'</div>'
			}

			for(var ind = 0; ind < data.allex.length; ind ++){
				if(data.allex[ind].prio == 1){
					Ele += '<div class="checkbox">'+
            		 '<label><input type="radio" value="'+data.allex[ind].id+'" name="exlanguage" '+isdisable+' checked> '+
            	 			data.allex[ind].exname+'</label>'+
         		 		'</div>'
				}else{
		 			Ele += '<div class="checkbox">'+
            	 		'<label><input type="radio" value="'+data.allex[ind].id+'" name="exlanguage" id="'+data.allex[ind].exsy+'"> '+
            	 			data.allex[ind].exname+'</label>'+
         		 	'</div>'
         		}
			}

			Ele += note;
			modelmisspelling_body.innerHTML = Ele

		})
	}

	var modelmisspelling_footer = modelmisspelling.getElementsByClassName("modal-footer")[0]
	var modelmisspelling_footer_button = modelmisspelling_footer.getElementsByTagName("button")[0]

	modelmisspelling_footer_button.onclick = function()
	{
		var input_radio = modelmisspelling_body.getElementsByTagName("input")
		if(input_radio.length > 1){
			var flag = false, exsy = "", value = "";
			for(var index = 0; index < input_radio.length; index++){
				if(input_radio[index].checked){
					flag = true;
					exsy = input_radio[index].id
					value = input_radio[index].value
					break;
				}
			}
		}

		if(flag && MYPRIOEX != exsy){
			changeTranslate_Misspelling("/languageex/user/changemissprio", value, function(data){
				MYPRIOEX = exsy
				console.log(data)
			})
		}

		$('#MisspellingpriorityHome').modal('hide');
	}

}


var delConversation = function(id, name){
	var confirmbox = confirm("Are you sure want to delete all messages with " + name + " ?");
	if(confirmbox = true){
		//ajax
		var time = new Date()
		choosedelConversation(id, time, function(data){
			console.log(data)
		})
	}
}


var reportUser = function(id, name){
	var modelreport = document.getElementById("ReportuserHome")
	$('#ReportuserHome').modal('show');

	var modelreport_body = modelreport.getElementsByClassName("modal-body")[0]
	var modelreport_title = modelreport.getElementsByClassName("modal-title")[0]

	modelreport_title.innerHTML = "Why report "+name+" ?"
	if(modelreport_body.innerHTML.length < 30){
		selectAllReport(function(data){
			var Ele = ""
			for(var ind = 0; ind < data.report.length; ind ++){
		 		Ele += '<div class="checkbox">'+
            	 	'<label><input type="checkbox" value="'+data.report[ind].code+'" name="'+data.report[ind].id+'">'+
            		 data.report[ind].content+'</label>'+
         		 	'</div>'
			}
			modelreport_body.innerHTML = Ele
		})
	}

	var modelreport_footer = modelreport.getElementsByClassName("modal-footer")[0]
	var modelreport_footer_button = modelreport_footer.getElementsByTagName("button")[0]

	modelreport_footer_button.onclick = function(){
		var index = 0, pos = 0;
		var input_checkbox = modelreport_body.getElementsByTagName("input")

		for(index = 0; index < input_checkbox.length; index++){
			if(input_checkbox[index].checked){
				_CHECKBOXREPORT[pos] = input_checkbox[index].name
				pos++;
			}
		}

		if(_CHECKBOXREPORT.length > 0){
			choosereportUser(id, new Date(), _CHECKBOXREPORT, function(data){
				console.log(data)
				for(index = 0; index < input_checkbox.length; index++)
					input_checkbox[index].checked = false;
				$('#ReportuserHome').modal('hide');
			})
		}
	}
}


var blockmsg_autocheckmiss = function(url, pid, cb){
	$.ajax({
        type: "POST",
        url: url,
        data:{id: pid, time: new Date()},
        success: function(data)//hien thi message
        {
            if(typeof cb == "function")
                cb(JSON.parse(data));//tra ve du lieu
        }
    })
}


var Blockmessages = function(el, pid, name){
	if(el.checked){
		var c = confirm("Are you sure want to block with "+ name + " ?")
		if(c){
			socket.emit('blockmsg', {
            	myid: MYID,
            	pid: pid,
            	signal: true
	    	}) 

	    	blockmsg_autocheckmiss("/languageex/user/blockmsg", pid, function(data){
	    		console.log(data)
	    	})
		}
	}else{
		socket.emit('blockmsg', {
            	myid: MYID,
            	pid: pid,
            	signal: false
	    	}) 

	    	blockmsg_autocheckmiss("/languageex/user/blockmsg", pid, function(data){
	    		console.log(data)
	    	})
	}
}

socket.on('blockmsgdone', function(data){//tin hieu gui den cho 2 phia
	
	if(data.signal){
		if(MYID == data.myid)
			document.getElementById(data.pid + "_mymsg").disabled = true;
		else
			document.getElementById(data.myid + "_mymsg").disabled = true;
	}else{
		if(MYID == data.myid)
			document.getElementById(data.pid + "_mymsg").disabled = false;
		else
			document.getElementById(data.myid + "_mymsg").disabled = false;
	}

})


var Auto_check_miss = function(el){
	if(el.checked){
		AUTOCHECKMISSPELLING = true
	}else{
		AUTOCHECKMISSPELLING = false
		blockmsg_autocheckmiss("/languageex/user/checkmiss", null, function(data){
	    	console.log(data)
	    })
		//get to server
	}
}