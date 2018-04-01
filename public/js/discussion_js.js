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
            	var err = "Status code err: " + xhr.statusText
            	cb(err, null)
            }

        }
    }
}


var Notify = function(){
	$('#Notify_post').modal('show')

}


var showTopic = function(topic)//topic is a object
{
	console.log(topic)
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
	postinfo: object 
**/
var showPost = function(postinfo)
{
	var element = "";

    element='<div class="popup-box4">'+

             '<div class="dropdown">'+
              '<a class="dropbtn"><h5 class="glyphicon glyphicon-chevron-down"></h5></a>'+
              '<div class="dropdown-content">'+
                '<a style="cursor:pointer;" onclick="">Report post</a>'+
                '<a style="cursor:pointer;" onclick="">Delete post</a>'+
                '<a style="cursor:pointer;" onclick="">Edit post</a>'+
                '<a style="cursor:pointer;" onclick="">Turn off comment</a>'+
                '<a style="cursor:pointer;" onclick="">Turn off notify</a>'+
              '</div>'+
             '</div>'+

              '<table style="margin-left: 5px;height:80px;">'+
                '<tr style="margin-top:5px;">'+
                  '<td><img src="'++'" style="height:47px;width:47px;"></td>'+
                 '<td><div style="margin-left:8px;padding:0px;">'+
                          '<p style="color:blue;margin-top:4px;">'+
                              '<a style="font-size:110%;cursor:pointer;" class="text-justify"><b>'++'</b></a> discussed the topic <b style="color:black;font-size:160%;"> Vocabulary</b>'+
                          '</p>'+
                    '<div style="margin-top:-9px;"><label style="font-size:90%;">'++'</label>'+
                    '</div></div>'+
                    '</td>'+
                '</tr>'+
              '</table>'+

                '<div style="height:auto;margin-top:10px;" class="form-group" >'+
                  '<textarea readonly class="form-control" style="min-height:10px;resize:none;font-size:17px;color:orange;background-color:white;border:none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow: none;">'+
                  '</textarea>'+
                  '<a style="margin-left: 3%;cursor: pointer;">See translation</a>'+
                  '<textarea readonly class="form-control" style="min-height:10px;resize:none;outline:none;font-size:15px;color:orange;background-color:white;border:none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;display:none;">'+
                  '</textarea>'+
                  '<div style="float:right;margin-right:10px;border: 1px solid blue;"></div>'+
                '</div>'+

              '<div class="divcmt">'+
                  '<img src="/img/dalike.jpg" onclick = "" style="margin-left:5px;width:36;height:29px;">'+
                  '<p style="margin-top:-24px;margin-left: 50px;color:blue;">Liked</p>'+
                  '<div style="margin-top:-22px;margin-left:26%;"><a style="cursor:pointer;" data-toggle="modal" data-target="#showInfoLikePost" onclick=""><span>40</span> people your post.</a></div>'+
              '</div>'+

              '<div class="divcmt1">'+
				
                  '<div style="border:1px solid #d5e8e8;height:auto;">'+
                      '<div style="margin-top:12px;">'+
                        '<a class="a4" onclick="">Show more comments(<span id="changecmt">8</span>)</a>'+
                      '</div>'+
                  '</div>'+

                  '<form style="margin-top:18px;margin-left:10px;">'+
                    '<table>'+
                      '<tr>'+
                        '<td><img src="" style="height:40px;width:42px;margin-top:5px;margin-left:-1px;"></td>'+
                        '<td>'+
                            '<div>'+
                              '<textarea style="resize:none;" rows="1" placeholder="Viết bình luận" class="divcmt2"></textarea>'+
                            '</div>'+
                        '</td>'+
                      '</tr>'+
                    '</table>'+
                 '</form>'+

                 '<div style="height:30px; margin-top:0px;"></div>'+

                 '<div style="width: auto;height: auto;" id="showcmtpostusers">'+
                 '</div>'+
                  
               '</div>'+
            '</div>'

     document.getElementById("showpostusers").innerHTML = element
}

showPost("cin hao")

var showComment = function(){
	var element = ''

    element = '<div style="min-height:40px;margin-top:5px;">'+
         '<img src="" width="41" height="42" style="float:left;margin-left:10px;margin-top:-2px;">'+
         '<p style="width:85%;word-wrap:break-word;margin-left:65px;"><span style="color:blue;font-size:108%;">Linh Văn </span>'+
            '</br> <span style="font-style:inherit;">woa thực sự được đó(trans)</span>'+
         '</p>'+
         '<div style="height:10px;margin-left:65px;font-size:90%;color:#474343;margin-top:-7px;">'+
            '<a class="a11" onclick="">  del  </a> <a class="a11" onclick="">  report  </a><a class="a11" onclick="">  trans  </a><span style="margin-left:10px;font-size: 80%;">11:25, 25/7/2018</span>'+
         '</div>'+
    '</div>'+
    '<div style="height:20px; margin-top:0px;"></div>'
    
}


var requestComment = function(){
	requestServer('/languageex/user/loadcmt', 'POST', {}, 0, function(err, data){
		if(err) alert(err)
		else console.log(data)
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


var submitComment = function(){

}


var selectComunityPost = function(){
	requestServer('/languageex/user/loadpost', 'POST', {}, 0, function(err, data){
		if(err) alert(err)
		else console.log(data)
	})
}

var selectRecentPost = function(){
	
}