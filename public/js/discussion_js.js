

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


/**
	url: link to server
	type: kieu POST,PUT, GET OR DELETE
	data: oject
**/

var requestServer = function(url, type, data, choose, cb){
    // Set up the AJAX request.
    var xhr = new XMLHttpRequest();
    // Open the connection.
    xhr.open(type, url, true);

    var formData;

    if(choose == 2){//set of key/value pairs to send, set to multipart/form-data.
    	formData = new formData();
    	formData.append("data", data)
   		xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
   	}else if(choose == 1){//body string
   		formData = data;
   	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   	}else{//json string
   		formData = JSON.stringify({data: data})
      	xhr.setRequestHeader("Content-type", "application/json");
     }

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


var formatTime = function(date){
	return date.getHours()+":"+ date.getMinutes() + " "+
			date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
}

var Notify = function(){
	$('#Notify_post').modal('show')

}


var showTopic = function(topic)//topic is a object
{
	//console.log(topic)
	var topicPost = document.getElementById('topicpost')
	var tpLg = topic.length-1;
	var element = '<option style="font-size:130%;" selected value="'+topic[tpLg].id+'">'+
	               topic[tpLg].name+'</option>'

	for(var index = tpLg-1; index >= 0; index--){
		element += '<option style="font-size:130%;" value="'+topic[index].id+'">'+
		           '<b>'+topic[index].name+'</b></option>'
	}

	topicPost.innerHTML = element
}


var loadTitlePost = function(){
	requestServer('/languageex/user/loadtitle', 'POST', {}, 0, function(err, data){
		if(err)  alert(err)
		else   showTopic(data.data)
	})	
}

loadTitlePost()
	
/**
	Posts: object chua thong tin cua bai dang
	User object chua thong tin nguoi da dang
	state la trang thai cua load tu server hoac dang realtime
**/

var showPost = function(User, Posts, state)
{
	var element = "";
	var id = Posts.pid;

	var imgLike = "/img/dalike.jpg"
	var contentLike = "Liked"

	if(!Posts.meliked){
		imgLike = "/img/dislike.png"
		contentLike = "Like"
	}

	var Time;
	if(state == 0)
		Time = Change_date(Posts.time)
	else
		Time = Change_date(new Date())

	var isMyPost = "", notMypost = ""
	if(User.id == MYID){
		isMyPost = '<a style="cursor:pointer;" onclick="deleteMyPost('+id+')">Delete post</a>'+
                '<a style="cursor:pointer;" onclick="editMyPost('+id+')">Edit post</a>'+
                '<a style="cursor:pointer;" onclick="turnofComment('+id+')">Turn off comment</a>'
	}

	if(User.id != MYID){
		notMypost = '<a style="cursor:pointer;" onclick="">Report post</a>'+
                   '<a style="cursor:pointer;" onclick="">Turn off notify</a>'
	}

	var istracked = ""
	if(Posts.istracked)  istracked = "(followed)"

    element = '<div class="popup-box4" id="'+id+'_posts">'+

             '<div class="dropdown">'+
              '<a class="dropbtn"><h5 class="glyphicon glyphicon-chevron-down"></h5></a>'+
              '<div class="dropdown-content">'+
                 notMypost+
                 isMyPost+
              '</div>'+
             '</div>'+

              '<table style="margin-left: 5px;height:80px;">'+
                '<tr style="margin-top:5px;">'+
                  '<td><img src="'+User.photo+'" style="height:47px;width:47px;" data="tooltip" title="'+User.email+'"></td>'+
                 '<td><div style="margin-left:8px;padding:0px;">'+
                          '<p style="color:blue;margin-top:4px;">'+
                              '<a style="font-size:108%;cursor:pointer;" class="text-justify" href="/languageex/user/profile?uid='+User.id+'"><b>'+User.name+'</b></a>'+
                                  ' discussed the topic <b style="color:black;font-size:150%;">'+Posts.title+'</b>'+
                          '</p><div style="margin-top:-9px;">'+
                                  '<label style="font-size:90%;">'+Time+'</label> '+istracked+'</div></div>'+
                    '</td>'+
                '</tr>'+
              '</table>'+

                '<div style="height:auto;margin-top:10px;" class="form-group" >'+

                  '<div id="'+id+'_contentofpost" style="font-size:17px;color:orange;background-color:white;height:auto;word-wrap:break-word;margin-left:2%;">'+
                   Posts.content+'</div>'+

                   '<textarea id="'+id+'_contenteditpost" class="form-control" style="display:none;height:auto" autofocus>'+Posts.content+'</textarea>'+

                   '<div id="'+id+'_showtrans" style="font-size:17px;color:black;background-color:white;'+
                       'height:auto;word-wrap:break-word;margin-left:2%;display:none;margin-top:2%;"></div>'+

                  '<a id="'+id+'_showlink" style="margin-left:3%;cursor:pointer;text-decoration:none;" onclick="translatePost('+id+')">See translation</a>'+
                  '<a id="'+id+'_hiddenlink" style="margin-left:3%;cursor:pointer;text-decoration:none;display:none;" onclick="backUpTranslate('+id+')">Hidden trans</a>'+
                  '<a id="'+id+'_editpostdone" style="margin-left:3%;cursor:pointer;text-decoration:none;display:none;" onclick="editPostDone('+id+')">Edit done</a>'+
                  '<input type = "hidden" id = "'+id+'_postcontent" value = "'+Posts.content+'">'+
                  '<div style="float:right;margin-right:10px;border: 1px solid blue;"></div>'+
                '</div>'+

                '<div class="divcmt">'+
                  '<img src="'+imgLike+'" onclick="likeOrDis('+id+')" id="'+id+'_likesrc" style="margin-left:5px;width:36;height:29px;">'+
                  '<p style="margin-top:-24px;margin-left:50px;color:blue;" id="'+id+'_likect">'+contentLike+'</p>'+
                  '<div style="margin-top:-22px;margin-left:26%;">'+
                     '<a style="cursor:pointer;" onclick="showUserLikePost('+id+')">'+
                     '<span id="'+id+'_numlike">'+Posts.totalliked+'</span> people likes post.</a></div>'+
                  '</div>'+

                  '<div class="divcmt1">'+
				
                    '<div style="border:1px solid #d5e8e8;height:auto;">'+
                      '<div style="margin-top:12px;">'+
                        '<a class="a4" onclick="">Show more comments(<span id="'+id+'_numcmt">'+Posts.totalcomment+'</span>)</a>'+
                      '</div>'+
                      '<div style="width: auto;height: auto;" id="'+id+'_showcmt"></div>'+
                    '</div>'+

                    '<div style="margin-top:18px;margin-left:10px;">'+
                     '<table>'+
                       '<tr>'+
                        '<td><img src="'+MYPHOTO+'" style="height:40px;width:42px;margin-top:5px;margin-left:-1px;" data="tooltip" title="'+MYNAME+'"></td>'+
                        '<td style="width:94%;">'+
                           '<input type="text" placeholder="Write your comments...." class="divcmt2" '+
                             'onkeypress="submitComment(event,'+id+')" id="'+id+'_writecmts">'+
                        '</td>'+
                       '</tr>'+
                     '</table>'+
                    '</div>'+

                   '<div style="height:30px; margin-top:0px;"></div>'+
                '</div>'+

            '</div>'

     document.getElementById("showpostusers").innerHTML += element
}

/**
	@@ id is post id
**/
var editMyPost = function(id){
	var _textareaEdit = document.getElementById(id+"_contenteditpost")
	var _postcontent = document.getElementById(id+"_contentofpost")
	var _buttonEditDone = document.getElementById(id+"_editpostdone")
	_textareaEdit.style.display = "block"
	_postcontent.style.display = "none"
	_buttonEditDone.style.display = "block"
}

/** 
	This function happen when event editMyPost are execute
	@@ id is a post of id
**/
var editPostDone = function(id){
	var _textareaEdit = document.getElementById(id+"_contenteditpost")
	var _postcontent = document.getElementById(id+"_contentofpost")
	var _buttonEditDone = document.getElementById(id+"_editpostdone")
	var _showlink = document.getElementById(id+"_showlink")
	var _showtrans = document.getElementById(id+"_showtrans")
	var _postcontenthd = document.getElementById(id+"_postcontent")	//input type hidden
	var newcontent = _textareaEdit.value

	if(newcontent == "" || newcontent.length < 100)
		alert("Please dont edit your post under 100 characters.")
	else if(_postcontent.innerHTML == newcontent)//noi dung moi va cu trung nhau
		alert("This is old content.Please try again.")
	else{
		_showtrans.innerHTML = "" //reset content of translation
		_postcontenthd.value = newcontent
		var data = {pid: id, uid: MYID, content: newcontent, time: new Date()}
		requestServer('/languageex/user/editPost', 'PUT', data, 0, function(err, data){
			if(err) alert(err)
			_textareaEdit.style.display = "none"
			_postcontent.innerHTML = newcontent
			_postcontent.style.display = "block"
			_showlink.style.display = "block"
			_buttonEditDone.style.display = "none"
		})
	}
}

/**
	this funtion will delete a post with id @@id
**/
var deleteMyPost = function(id){
	var r = confirm("Are you sure want to delete your post?")
	if(r == true){

		alert("Done.")
	}
}
 
/**
	click event image like
	@@ id is id of post
**/
var likeOrDis = function(id){
	var imgStateLike = document.getElementById(id+"_likesrc")
	var contentLike = document.getElementById(id+"_likect")
	var numlike = document.getElementById(id+"_numlike")

	var namesrc = imgStateLike.src.replace(/^.*[\\\/]/, '');
	if(namesrc == "dalike.jpg"){
		requestServer('/languageex/user/likepost', 'DELETE', {id: id}, 0, function(err, data){
			if(err) alert(err)
			else{
				imgStateLike.src = "/img/dislike.png"
				contentLike.innerHTML = "Like"
				numlike.innerHTML = parseInt(numlike.innerHTML)-1;
			}
		})
		
	}else{
		requestServer('/languageex/user/likepost', 'POST', {id: id}, 0, function(err, data){
			if(err) alert(err)
			else{
				imgStateLike.src = "/img/dalike.jpg"
				contentLike.innerHTML = "Liked"
				numlike.innerHTML = parseInt(numlike.innerHTML)+1;
			}
		})
	}
}

/**
	hien thi nhung nguoi dung like bai dang
**/
var showUserLikePost = function(postid)
{
	$('#showuserlikespost').modal('show')
	var element = '<table class="table"><tbody>'
	requestServer('/languageex/user/loadinfolikepost', 'POST', {id: postid}, 0, function(err, data){
		if(err) alert(err)
		else{
			if(data){
			 	var Length = data.userslikedpost.length
			 	if(Length > 0){
					for(var ind = 0; ind < Length; ind++){
						element += '<tr><td><img class="img-rounded" height="40" width="40" alt="Avatar" src="'+
					       data.userslikedpost[ind].photo+'"></td>'+
					       '<td><h4>'+data.userslikedpost[ind].name+'</h4></td>'+
					       '<td><button type="button" class="btn btn-success">View info</button></td>'
					}
					element += '</tbody></table>'

					var modalBody = document.getElementById("showuserlikespost").getElementsByClassName("modal-body")[0]
					modalBody.innerHTML = element
			 }
		    }
		}
	})

}

/**
	translate content of post
	@@ id is id of post
**/
var translatePost = function(id){

    var _showtrans = document.getElementById(id+"_showtrans")
    var _showlink = document.getElementById(id+"_showlink")	
    var _hiddenlink = document.getElementById(id+"_hiddenlink")	
    var content = document.getElementById(id+"_postcontent").value

	if(_showtrans.innerHTML == ""){	
	 	Translate_or_Misspelling("/languageex/user/translate", 
			MYPRIOEX, MYPRIONAT, content, function(data){	  	
			if(data.content.error == null){
		   		_showtrans.innerHTML = data.content.translated
			}else
				_showtrans.innerHTML = data.content.error

			_hiddenlink.style.display = "block";
		    _showlink.style.display = "none";	
		    _showtrans.style.display = "block"
		})
	}else{
		_hiddenlink.style.display = "block";
		_showlink.style.display = "none";
		_showtrans.style.display = "block"
	}

}

/**
	this funtion happen when user want to hidden translate text
	@@ id is id of post
**/
var backUpTranslate = function(id){
	var _showtrans = document.getElementById(id+"_showtrans")
    var _showlink = document.getElementById(id+"_showlink")	
    var _hiddenlink = document.getElementById(id+"_hiddenlink")	

    _hiddenlink.style.display = "none";
    _showlink.style.display = "block";	
    _showtrans.style.display = "none"
}

/**
 make random id for comments
**/
function makerandomid(){
    var text = "";
    var possible = "0123456789";

    for( var i = 0; i < 20; i++ )//ma xac thuc co ngau nhien 45 ki tu
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
/**
	postid la id cua bai dang
	Commentinfor la 1 object chua thong tin cua commnet
	Userinfo la thong tin cua nguoi comment
	state la trang thai load tu server hoac realtime
 **/
var showComment = function(postid, Commentinfo, Userinfo, state){
	var element = '', ismycmt = "";
	var Time, randomid = makerandomid();
	
	if(state == 0)
		Time = formatTime(new Date(Commentinfo.time))
	else
		Time = formatTime(new Date())

	if(MYID == Userinfo.id){//neu comment la cua toi thi t co the xoa hoac edit no
		ismycmt = '<a class="a11" onclick="deleteMyCmt('+Commentinfo.id+')">  del  </a>'+
                  '<a class="a11" onclick="">  edit  </a>'
	}

    element = '<div style="min-height:40px;margin-top:5px;">'+
         '<img src="'+Userinfo.photo+'" width="41" height="42" style="float:left;margin-left:10px;margin-top:-2px;">'+
         '<p style="width:85%;word-wrap:break-word;margin-left:65px;"><span style="color:blue;font-size:108%;">'+Userinfo.name+'</span>  '+
            Commentinfo.content+' </br> <span style="font-style:inherit;color:red;" id="'+randomid+'_showtranscmt"></span>'+
         '</p>'+
         '<div style="height:10px;margin-left:65px;font-size:90%;color:#474343;margin-top:-7px;">'+
         	ismycmt+
            '<a class="a11" onclick="translateCmt(\''+randomid+'\')">  trans  </a>'+
            '<span style="margin-left:10px;font-size: 80%;">'+Time+'</span>'+
         '</div>'+
         '<input type="hidden" value="'+Commentinfo.content+'" id="'+randomid+'_cmtcontent" >'+
    '</div>'+
    '<div style="height:10px; margin-top:0px;"></div>'

    document.getElementById(postid+"_showcmt").innerHTML += element
}

/**
 id is a random id of comment
**/
var MAXTIMESHOWTRANSCMT = 15000//max time show translate comment
var translateCmt = function(id)
{
	var content = document.getElementById(id+"_cmtcontent").value
	var _showtranscmt = document.getElementById(id+"_showtranscmt")
	if(_showtranscmt.innerHTML == ""){
		Translate_or_Misspelling("/languageex/user/translate", 
			MYPRIOEX, MYPRIONAT, content, function(data){	  	
			if(data.content.error == null)
				_showtranscmt.innerHTML = data.content.translated
			else
				_showtranscmt.innerHTML = data.content.error
			setTimeout(function(){
				_showtranscmt.style.display = "none"
			}, MAXTIMESHOWTRANSCMT)
		})
	}
}

/**
	@@postid lay cac comment cua bai dang postid
**/
var requestComment = function(postid){
	requestServer('/languageex/user/loadcmt', 'POST', {id: postid}, 0, function(err, data){
		if(err) alert(err)
		else{
			var Length = data.listcmts.length
			var _showmorecmt = document.getElementById(postid+"_numcmt")
			_showmorecmt.innerHTML = parseInt(_showmorecmt.innerHTML) - Length
			if(Length > 0){
				for(var ind = 0; ind < Length; ind++){
					showComment(postid, data.listcmts[ind].comment, data.listcmts[ind].user, 0)
				}
			}
		}
	})
}

/** 
	@@ id is id of comment
**/
var deleteMyCmt = function(id){

}


var divcontentpost = document.getElementById("commentinpost")
var content = divcontentpost.getElementsByTagName("textarea")[0]
var errnotify = divcontentpost.getElementsByTagName("p")[0]


content.onclick = function(){
	errnotify.style.display = "none"
}

/**
	create post of user
**/
var submitPost = function(){
	
	if(content.value == ""){
		errnotify.innerHTML = "##) Do not empty this field."
		errnotify.style.display = "block"

	}else if(content.value.length < 100){
		errnotify.innerHTML = "##) This discussion too short, may be > 100 characters."
		errnotify.style.display = "block"
	}else{

		var selectTitle = document.getElementById("topicpost")
		var value = selectTitle[selectTitle.selectedIndex].value;
		var data = {content: content.value, title: value, time: new Date()}//data submit to server

		var User = {
			id: MYID,
			email: MYEMAIL,
			level: MYLEVEL,
			name: MYNAME,
			photo: MYPHOTO,
			score: MYSCORE
		}

		var Posts = {
			pid: null,
			istracked: null,
			meliked: false,
			content: content.value,
			time: data.time,
			title: selectTitle[selectTitle.selectedIndex].text,
			totalcomment:0,
			totalliked:0,
			turnofcmt:0,
		}

		requestServer('/languageex/user/createPost', 'POST', data, 0, function(err, data){
			if(err) alert(err)
			else{//tra du lieu ve thanh cong
				content.value = ""
				selectTitle.selectedIndex = "0";
				var allpostafter = document.getElementById("showpostusers").innerHTML
				document.getElementById("showpostusers").innerHTML = ""
				console.log(data)
				Posts.pid = data.resp
				showPost(User, Posts, 1)
				document.getElementById("showpostusers").innerHTML += allpostafter
			}
		})
	}
}

/**
	@@e: check event press keyboard
	@@ postid: user comment in specifix post
**/
var submitComment = function(e, postid){
	if(e.keyCode == 13){
		var contentcmt = document.getElementById(postid+"_writecmts")
		if(contentcmt.value == "")
			alert("Please dont enter empty characters.")
		else{
			//contentcmt.setSelectionRange(0,0); using for textarea
			//submit to server
			var data = {id: postid, uid: MYID, content: contentcmt.value, time: new Date() }
			requestServer('/languageex/user/createcmt', 'POST', data, 0, function(err, dataid){
				if(err) alert(err)
				else{
					contentcmt.value = ""
					data.id = dataid
					var User = {id: MYID, name: MYNAME, photo: MYPHOTO, level: MYLEVEL, score: MYSCORE};
					showComment(postid, data, User, 1)
				    console.log(data)
				}
			})
		}
	}
}

/** 
 auto return all of posts
**/
var selectComunityPost = function(){
	document.getElementById("showpostusers").innerHTML = ""
	requestServer('/languageex/user/loadpost', 'POST', {}, 0, function(err, data){
		if(err) alert(err)
		else{
			var Length = data.data.length
			if(Length){
				console.log(data)
				for(var ind = 0; ind < Length; ind++){
		 			showPost(data.data[ind].user, data.data[ind].posts, 0)
		 			requestComment(data.data[ind].posts.pid)
		 		}
		 	}
		}
	})
}
//tu dong load comment về máy
selectComunityPost();

var selectRecentPost = function(){
	document.getElementById("showpostusers").innerHTML = ""
	requestServer('/languageex/user/loadrcpost', 'POST', {}, 0, function(err, data){
		if(err) alert(err)
		else {
			console.log(data)
			var Length = data.data.length
			if(Length){
				for(var ind = 0; ind < Length; ind++){
		 			showPost(data.data[ind].user, data.data[ind].posts, 0)
		 			requestComment(data.data[ind].posts.pid)
		 		}
		 	}
		}
	})
}
/**
	select post of own user
**/
var selectMyPost = function()
{
	document.getElementById("showpostusers").innerHTML = ""
	requestServer('/languageex/user/loadmypost', 'POST', {}, 0, function(err, data){
		if(err) alert(err)
		else{
			console.log(data)
			var Length = data.listmypost.posts.length
			if(Length){
				for(var ind = 0; ind < Length; ind++){
		 			showPost(data.listmypost.user, data.listmypost.posts[ind], 0)
		 			requestComment(data.listmypost.posts[ind].pid)
		 		}
		 	}
		}
	})
}
