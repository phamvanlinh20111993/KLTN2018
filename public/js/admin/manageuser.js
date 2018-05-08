

function Logout(){
   sessionStorage.clear();
   location.href = '/languageex/admin/logout'
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
          //  console.log("da chay thanh cong ham request")
        }
        else{
        	   cb("Lỗi không xác định. ", null)
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
            	var err = "Mã trạng thái: " + xhr.status + ". Request trang web bị hủy."
            	cb(err, null)
            }
        }
    }
}

var showUser = function(ele, data){

   var edit = '<td class="center"><button class="btn btn-warning" onclick="editUser()">Sửa</button></td>'
   var block = '<td class="center"><button class="btn btn-primary" onclick="lockUser('+data.id+')">Khóa</button></td>'
   var notdel = ""
   if(data.provider !="admin")
      edit = '<td class="center">Không thể sửa</td>'
   if(data.block > 0){
      block = '<td class="center"><button class="btn btn-primary" onclick="unlockUser('+data.id+')">Bỏ khóa</button></td>'
      notdel = "disabled"
   }

   var element = '<tr>'+
            '<td>'+data.name+'</td>'+
            '<td>'+data.email+'</td>'+
            '<td> <img src= "'+data.photo+'" height="40" width="40"></td>'+
            '<td>'+data.score+'</td>'+
            '<td class="center">'+data.gender+'</td>'+
            edit+
            '<td class="center"><button class="btn btn-danger" onclick="deleteUser('+data.id+')" '+notdel+'>Xóa</button></td>'+
            block
            '</tr>'

   ele.innerHTML += element
}

var editUser = function(){

}


var unlockUser = function(id){
   requestServer('/languageex/admin/home/unlock', "DELETE", {id : id}, 0, function(err, data){
         if(err) alert(err)
         else{
            alert("đã bỏ khóa thành công người dùng " + id)
            location.reload()
         }
      })
}


var deleteUser = function(id){
  var r = confirm("Quản trị viên muốn xóa vĩnh viễn người dùng này?")
  if(r== true){
       requestServer('/languageex/admin/home/manage/user', "DELETE", {id:id, type: "delete"}, 0, function(err, data){
         if(err) alert(err)
         else{
            alert("đã xóa thành công người dùng " + id)
            location.reload()
         }
      })
  }
}

var lockUser = function(id){
   $("#lockusermodal").modal()
   document.getElementById("lockuserdone").onclick = function(){
      var e = document.getElementById("timeblock");
      var strvl = e.options[e.selectedIndex].value;
      console.log(parseInt(strvl))
      var reason = document.getElementById("reasondelete").value
      if(reason == "" || reason.length < 10){
         alert("Số kí tự tối thiểu là 10.")
      }else{
         var ctime = new Date()
         ctime.setDate(new Date().getDate()+parseInt(strvl))

         requestServer('/languageex/admin/home/manage/user', "DELETE", 
            {id:id, type: "block", time: time, reason: reason}, 0, function(err, data){
            if(err) alert(err)
            else{
                alert("đã khóa thành công người dùng "+id+" thời gian "+parseInt(strvl)+" ngày.")
                location.reload()
            }
         })
      }
   }
}


var loadUser = function(){
   var tableex = document.getElementById("dataTables-example")
   var tbodytable = tableex.getElementsByTagName("tbody")[0]

   requestServer('/languageex/admin/home/manage/user?loaduser=true', "GET", {}, 0, function(err, data){
      if(err) alert(err)
      else{
         console.log(data)
         if(data.user.length > 0){
            for(var ind = 0; ind < data.user.length; ind++){
               showUser(tbodytable, data.user[ind])
            }
         }
      }
   })
}

loadUser()


var addUser = function(){

   requestServer('/languageex/admin/loadlg', 'GET', {}, 0, function(err, data){
       if(err) alert(err)
       else{
            console.log(data)
         if(data.Lang.length > 0 && data.De.length > 0){
            //hien thi ngon ngu trao doi
            console.log("length "+data.Lang.length)
            var exchangelg = document.getElementById("selectexlg")
            var nativelg = document.getElementById("selectnativelg")
            var degree = document.getElementById("selectde")

            for(var i = 0; i < data.Lang.length; i++){
               exchangelg.innerHTML += '<option value="'+data.Lang[i].id+'">'+data.Lang[i].name+'</option>'
               nativelg.innerHTML += '<option value="'+data.Lang[i].id+'">'+data.Lang[i].name+'</option>'
            }

            for(var ind = 0; ind < data.De.length; ind++){
                degree.innerHTML+='<option value="'+data.De[ind].id+'">'+data.De[ind].name+'</option>'
            }

         }
       }
            
   })

   $("#addusermodal").modal()
}