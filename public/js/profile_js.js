
//theo doi hoac bo theo doi nguoi dung
var ajaxRequest = function(url, data, callback) {//data is a object
  // body...
  $.ajax({
        type: "POST",
        url: url,
        data:{ data: JSON.stringify(data) },
        error: function(xhr, status, error){
          callback(null, error)
        },
        success: function(data)
        {
            if(typeof callback == "function"){
                callback(data, null);//tra ve du lieu
            }
        }
    })
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

/** client **/
var Follow = function(id, name){
	var data = {id: id, follow: true, time: new Date()}
    ajaxRequest('/languageex/home/follow', data, function(data, err){
        if(err) alert(err)
        else{
            alert("You followed " + name)
            location.reload()
        }
    })
}

var unFollow = function(id, name){
    var data = {id: id, follow: false}
    ajaxRequest('/languageex/home/unfollow', data, function(data, err){
        if(err) alert(err)
        else{
            alert("You unfollowed " + name)
            location.reload()
        }
    })
}

//mai lam
var Report = function(id, name){
	alert(id)
    $('#reportPostUser').modal('show')
    var reportp = document.getElementById("reportPostUser")
    var reportpBody = reportp.getElementsByClassName("modal-body")[0]
    var reportTitle = reportp.getElementsByClassName("modal-title")[0]
    reportTitle.innerHTML = "Why report this post of "+name+" ?"

    HTTP_REQUEST('/languageex/user/loadrppost', 'GET',{}, 0, function(err, data){
        if(err) alert(err)
        else{
            var element = ""
            console.log(data)
            for(var ind = 0; ind < data.data.length; ind ++){
                element += '<div class="checkbox">'+
                    '<label><input type="checkbox" value="'+data.data[ind].code+'" name="'+data.data[ind].id+'">'+
                     data.data[ind].content+'</label></div>'
            }
            reportpBody.innerHTML = element
        }
    })
}


var blockModal = document.getElementById("blockUserModal")
var Block = function(id, name){
	$('#blockUserModal').modal({backdrop: 'static', keyboard: false})
    var blockModalBody = blockModal.getElementsByClassName("modal-body")[0]
    var blockModalTitle = blockModal.getElementsByClassName("modal-title")[0]
    blockModalTitle.innerHTML = "<h3> Block box "+name+"</h3>"
    //done
    var blockModalButton = blockModal.getElementsByTagName("button")[1]
    blockModalButton.onclick = function(){
        $('#blockUserModal').modal("hide")
        var Reason = blockModal.getElementsByTagName("textarea")[0]
        var data = {id: id, reason: Reason.value, time: new Date()}
        HTTP_REQUEST('/languageex/user/blockuser', 'POST', data, function(err, data){
            if(err) alert(err)
            else{
                alert("You blocked " + name)
                location.reload()
            }
        })
    }
}


var unBlock = function(id, name){
   var data = {id: id, time: new Date()}
   HTTP_REQUEST('/languageex/user/unblockuser', 'DELETE', data, function(err, data){
        if(err) alert(err)
        else{
            console.log(data)
            alert("You unblocked "+ name)
            location.reload()
        }
    })
}



/** own profile **/
var myBlockList = function(id)
{
    $('#blocklisusermodal').modal('show')
    var myblocklists = document.getElementById("blocklisusermodal")
    var myblocklistsBody = myblocklists.getElementsByClassName("modal-body")[0]
    var myblocklistsTitle = myblocklists.getElementsByClassName("modal-title")[0]

    HTTP_REQUEST('/languageex/user/myblocklists', 'POST', {id: id}, function(err, data){
        if(err) alert(err)
        else{
            var Length = data.data.length
            myblocklistsTitle.innerHTML = "Your black lists ("+Length+")"
            var element = "<table class='table table-condensed'><tbody>"
            if(Length > 0){
                for(var ind = 0; ind < Length; ind++){
                    element += "<tr id='"+data.data[ind].id+"_blocklist'><td><img src='"+data.data[ind].photo+"' class='img-rounded' alt='Avatar' height='40'></td>"+
                         "<td>"+data.data[ind].name+"</td>"+
                         "<td><button type='button' class='btn btn-warning' onclick='reMoveBlock("+data.data[ind].id+")'>Remove</button></td></tr>"
                }
                element += "</tbody></table>"
            }

            myblocklistsBody.innerHTML = element
        }
    })

}

var reMoveBlock = function(id){
    var DOM_unblock = document.getElementById(id+"_blocklist")
    DOM_userfollow.style.display = "none"
}


var myFollowList = function(id)
{
    $('#followlisusermodal').modal('show')
    var myfollowlists = document.getElementById("followlisusermodal")
    var myfollowlistsBody = myfollowlists.getElementsByClassName("modal-body")[0]
    var myfollowlistsTitle = myfollowlists.getElementsByClassName("modal-title")[0]


    HTTP_REQUEST('/languageex/user/myfollowers', 'POST', {id: id}, function(err, data){
        if(err) alert(err)
        else{
             var Length = data.data.length
             myfollowlistsTitle.innerHTML = "Your follow lists ("+Length+")"
             var element = "<table class='table table-condensed'><tbody>"
            if(Length > 0){
                for(var ind = 0; ind < Length; ind++){
                     element += "<tr id='"+data.data[ind].id+"_follow'><td><img src='"+data.data[ind].photo+"' class='img-rounded' alt='Avatar' height='40'></td>"+
                         "<td>"+data.data[ind].name+"</td>"+
                         "<td><button type='button' class='btn btn-info' onclick='unFollowList("+data.data[ind].id+")', \'"+data.data[ind].name+"\'>Unfollow</button></td></tr>"
                }
                element += "</tbody></table>"

                myfollowlistsBody.innerHTML = element
            }
        }
    })
}

var unFollowList = function(id, name){
    var DOM_userfollow = document.getElementById(id+"_follow")
    var data = {id: id, follow: false} 
    ajaxRequest('/languageex/home/unfollow', data, function(data, err){
        if(err) alert(err)
        else{ 
            DOM_userfollow.style.display = "none"
            alert("You unfollowed "+ name)
        }
     })
}