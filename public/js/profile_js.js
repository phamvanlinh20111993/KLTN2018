


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
var Follow = function(id){
	alert(id)
}

var Report = function(id){
	alert(id)
}

var Block = function(id){
	alert(id)
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
                    element += "<tr><td><img src='"+data.data[ind].photo+"' class='img-rounded' alt='Avatar' height='40'></td>"+
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
             var element = ""
            if(Length > 0){
                for(var ind = 0; ind < Length; ind++){
                     element += "<tr><td><img src='"+data.data[ind].photo+"' class='img-rounded' alt='Avatar' height='40'></td>"+
                         "<td>"+data.data[ind].name+"</td>"+
                         "<td><button type='button' class='btn btn-info' onclick='unFollowList("+data.data[ind].id+")'>Remove</button></td></tr>"
                }
                element += "</tbody></table>"

                myfollowlistsBody.innerHTML = element
            }
        }
    })
}

var unFollowList = function(id){

}