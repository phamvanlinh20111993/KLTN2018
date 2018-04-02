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
		Time = formatTime(new Date(Posts.time))
	else
		Time = formatTime(new Date())

	var isMyPost = ""
	if(User.id == MYID){
		isMyPost = '<a style="cursor:pointer;" onclick="">Delete post</a>'+
                '<a style="cursor:pointer;" onclick="">Edit post</a>'+
                '<a style="cursor:pointer;" onclick="">Turn off comment</a>'
	}

    element='<div class="popup-box4" id="'+id+'_posts">'+

             '<div class="dropdown">'+
              '<a class="dropbtn"><h5 class="glyphicon glyphicon-chevron-down"></h5></a>'+
              '<div class="dropdown-content">'+
                '<a style="cursor:pointer;" onclick="">Report post</a>'+
                 isMyPost+
                '<a style="cursor:pointer;" onclick="">Turn off notify</a>'+
              '</div>'+
             '</div>'+

              '<table style="margin-left: 5px;height:80px;">'+
                '<tr style="margin-top:5px;">'+
                  '<td><img src="'+User.photo+'" style="height:47px;width:47px;"></td>'+
                 '<td><div style="margin-left:8px;padding:0px;">'+
                          '<p style="color:blue;margin-top:4px;">'+
                              '<a style="font-size:110%;cursor:pointer;" class="text-justify"><b>'+User.name+'</b></a>'+
                                  ' discussed the topic <b style="color:black;font-size:160%;">'+Posts.title+'</b>'+
                          '</p><div style="margin-top:-9px;">'+
                                  '<label style="font-size:90%;">'+Time+'</label></div></div>'+
                    '</td>'+
                '</tr>'+
              '</table>'+

                '<div style="height:auto;margin-top:10px;" class="form-group" >'+
                  '<textarea readonly class="form-control" style="height:auto;resize:none;font-size:17px;'+
                     'color:orange;background-color:white;border:none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;">'+
                   Posts.content+'</textarea>'+
                  '<a style="margin-left: 3%;cursor: pointer;text-decoration:none;">See translation</a>'+

                  '<textarea readonly class="form-control" style="min-height:10px;resize:none;font-size:17px;display:none;'+
                      'color:orange;background-color:white;border:none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;"">'+
                  '</textarea>'+
                  '<div style="float:right;margin-right:10px;border: 1px solid blue;"></div>'+
                '</div>'+

                '<div class="divcmt">'+
                  '<img src="'+imgLike+'" onclick="likeOrDis('+id+')" id="'+id+'_likesrc" style="margin-left:5px;width:36;height:29px;">'+
                  '<p style="margin-top:-24px;margin-left: 50px;color:blue;" id="'+id+'_likect">'+contentLike+'</p>'+
                  '<div style="margin-top:-22px;margin-left:26%;">'+
                     '<a style="cursor:pointer;" onclick="showUserLikePost('+id+')">'+
                     '<span id="'+id+'_numlike">'+Posts.totalliked+'</span> people likes your post.</a></div>'+
                  '</div>'+

                  '<div class="divcmt1">'+
				
                    '<div style="border:1px solid #d5e8e8;height:auto;">'+
                      '<div style="margin-top:12px;">'+
                        '<a class="a4" onclick="">Show more comments(<span id="'+id+'_numcmt">'+Posts.totalcomment+'</span>)</a>'+
                      '</div>'+
                      '<div style="width: auto;height: auto;" id="'+id+'_showcmt"></div>'+
                    '</div>'+

                    '<form style="margin-top:18px;margin-left:10px;">'+
                     '<table>'+
                       '<tr>'+
                        '<td><img src="'+User.photo+'" style="height:40px;width:42px;margin-top:5px;margin-left:-1px;"></td>'+
                        '<td>'+
                           '<textarea style="resize:none;" rows="1" placeholder="Write your comments...." class="divcmt2" '+
                             'onkeypress="submitComment(event,'+id+')" id="'+id+'_writecmts"></textarea>'+
                        '</td>'+
                       '</tr>'+
                     '</table>'+
                    '</form>'+

                   '<div style="height:30px; margin-top:0px;"></div>'+
                '</div>'+

            '</div>'

     document.getElementById("showpostusers").innerHTML += element
}
 
//click event image like
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


var showUserLikePost = function(postid){

}

/**
	postid la id cua bai dang
	Commentinfor la 1 object chua thong tin cua commnet
	Userinfo la thong tin cua nguoi comment
	state la trang thai load tu server hoac realtime
 **/
var showComment = function(postid, Commentinfo, Userinfo, state){
	var element = ''
	var Time;
	
	if(state == 0)
		Time = formatTime(new Date(Commentinfo.time))
	else
		Time = formatTime(new Date())

    element = '<div style="min-height:40px;margin-top:5px;">'+
         '<img src="'+Userinfo.photo+'" width="41" height="42" style="float:left;margin-left:10px;margin-top:-2px;">'+
         '<p style="width:85%;word-wrap:break-word;margin-left:65px;"><span style="color:blue;font-size:108%;">'+Userinfo.name+'</span>  '+
            Commentinfo.content+' </br> <span style="font-style:inherit;" id='+0+'></span>'+
         '</p>'+
         '<div style="height:10px;margin-left:65px;font-size:90%;color:#474343;margin-top:-7px;">'+
            '<a class="a11" onclick="">  del  </a> <a class="a11" onclick="">  report  </a><a class="a11" onclick="">  trans  '+
                '</a><span style="margin-left:10px;font-size: 80%;">'+Time+'</span>'+
         '</div>'+
    '</div>'+
    '<div style="height:10px; margin-top:0px;"></div>'

    document.getElementById(postid+"_showcmt").innerHTML += element
}


var requestComment = function(postid){
	requestServer('/languageex/user/loadcmt', 'POST', {id: postid}, 0, function(err, data){
		if(err) alert(err)
		else{
			var Length = data.listcmts.length
			if(Length > 0){
				for(var ind = 0; ind < Length; ind++){
					showComment(postid, data.listcmts[ind].comment, data.listcmts[ind].user, 0)
				}
			}
		}
	})
}


var divcontentpost = document.getElementById("commentinpost")
var content = divcontentpost.getElementsByTagName("textarea")[0]
var errnotify = divcontentpost.getElementsByTagName("p")[0]


content.onclick = function(){
	errnotify.style.display = "none"
}


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
		var data = {content: content.value, title: value, time: new Date()}

		requestServer('/languageex/user/createPost', 'POST', data, 0, function(err,data){
			if(err) alert(err)
			else{//tra du lieu ve thanh cong
				content.value = ""
				selectTitle.selectedIndex = "0";

			}
		})
	}
}


var submitComment = function(e, postid){
	if(e.keyCode == 13){
		var contentcmt = document.getElementById(postid+"_writecmts")
		if(contentcmt.value == "")
			alert("Please dont enter empty characters.")
		else{
			var data = { id: postid, uid: MYID, content: contentcmt.value, time: new Date() }
			contentcmt.setSelectionRange(0,0);
			contentcmt.value = ""
			//submit to server
		//	requestServer('/languageex/user/createcmt', 'POST', data, 0, function(err, data){
		//		if(err) alert(err)
		//		else{
			
					var User = {id: MYID, name: MYNAME, photo: MYPHOTO, level: MYLEVEL, score: MYSCORE};
					showComment(postid, data, User, 1)
				   // console.log(data)
		//		}
		//	})
		}
	}
}


var selectComunityPost = function(){
	requestServer('/languageex/user/loadpost', 'POST', {}, 0, function(err, data){
		if(err) alert(err)
		else console.log(data)
	})
}

var selectRecentPost = function(){
	document.getElementById("showpostusers").innerHTML = ""
	requestServer('/languageex/user/loadrcpost', 'POST', {}, 0, function(err, data){
		if(err) alert(err)
		else console.log(data)
	})
}

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
		 		}
		 	}
		}
	})
}
