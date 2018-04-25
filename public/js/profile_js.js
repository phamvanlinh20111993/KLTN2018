
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

//gui report
var _CHECKBOXREPORTPROFILE = []//mang luu tru cac gia tri
var Report = function(id, name){
    $('#ReportProfileUser').modal('show')
    var reportpr = document.getElementById("ReportProfileUser")
    var reportpBody = reportpr.getElementsByClassName("modal-body")[0]
    var reportTitle = reportpr.getElementsByClassName("modal-title")[0]
    reportTitle.innerHTML = "Tại sao report thông tin của "+name+" ?"

    HTTP_REQUEST('/languageex/user/loadrpprofile', 'POST', {}, function(err, data){
        if(err) alert(err)
        else{
            var element = ""
            console.log(data)
            for(var ind = 0; ind < data.data.length; ind ++){
                element += '<div class="checkbox">'+
                    '<label><input type="checkbox" value="'+data.data[ind].code+'" name="'+data.data[ind].id+'">'+
                     data.data[ind].content+'</label></div>'
            }
            element += '<div class="alert alert-warning">'+
              '<strong>Cảnh báo! </strong> Không lạm dụng tính năng này, quản trị viên sẽ xem xét và chặn những người lạm dụng tính năng này. Trân trọng'+
            '</div>'
            reportpBody.innerHTML = element
        }
    })

    var modelreportpr_footer = reportpr.getElementsByClassName("modal-footer")[0]
    var modelreportpr_footer_button = modelreportpr_footer.getElementsByTagName("button")[0]

    modelreportpr_footer_button.onclick = function(){

        var index = 0, pos = 0;
        var input_checkbox = reportpBody.getElementsByTagName("input")

        for(index = 0; index < input_checkbox.length; index++){
            if(input_checkbox[index].checked){
                _CHECKBOXREPORTPROFILE[pos] = input_checkbox[index].name
                pos++;
            }
        }

        if(_CHECKBOXREPORTPROFILE.length > 0){
            var data = {
                whorppr: MYID,
                rpw: id,
                code: _CHECKBOXREPORTPROFILE,
                time: new Date(), 
            }

            HTTP_REQUEST('/languageex/user/reportprofile', 'POST', data, function(err, data){
                if(err) throw err
               // console.log(data)
                alert("Report successed!")
                for(index = 0; index < input_checkbox.length; index++)
                    input_checkbox[index].checked = false;
                $('#ReportProfileUser').modal('hide');
            })

            _CHECKBOXREPORTPROFILE = []
        }
    }
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
            myblocklistsTitle.innerHTML = 'Danh sách đen ('+Length+')'
            var element = '<table class="table table-condensed"><tbody>'
            if(Length > 0){
                for(var ind = 0; ind < Length; ind++){
                    element += '<tr id="'+data.data[ind].id+'_blocklist"><td><img src="'+data.data[ind].photo+'" class="img-rounded" alt="Avatar" height="40"></td>'+
                         "<td>"+data.data[ind].name+"</td>"+
                         '<td><button type="button" class="btn btn-warning" onclick="reMoveBlock('+data.data[ind].id+',\''+data.data[ind].name+'\')">Xóa khỏi ds</button></td></tr>'
                }
                element += '</tbody></table>'
            }

            myblocklistsBody.innerHTML = element
        }
    })

}

//khong block nguoi dung nua
var reMoveBlock = function(id, name){
    var DOM_unblock = document.getElementById(id+"_blocklist")
    DOM_unblock.style.display = "none"
    var data = {id: id, block: false} 
    HTTP_REQUEST('/languageex/user/unblockuser', 'DELETE', data, function(err, data){
        if(err) alert(err)
        else{ 
            DOM_unblock.style.display = "none"
            alert("You unblocked "+ name)
        }
     })
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
             myfollowlistsTitle.innerHTML = 'Danh sách theo dõi ('+Length+')'
             var element = '<table class="table table-condensed"><tbody>'
            if(Length > 0){
                for(var ind = 0; ind < Length; ind++){
                    var isfollow = ""
                    if(data.data[ind].isfollow)
                        isfollow = ' (blocked)'
                     element += '<tr id="'+data.data[ind].id+'_follow"><td><img src="'+data.data[ind].photo+'" class="img-rounded" alt="Avatar" height="40"></td>'+
                         '<td><b>'+data.data[ind].name+'</b>'+isfollow+'</td>'+
                         '<td><button type="button" class="btn btn-info" onclick="unFollowList('+data.data[ind].id+',\''+data.data[ind].name+'\')">Bỏ theo dõi</button></td></tr>'
                }
                element += '</tbody></table>'

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


var addMoreExchange = function(id){
    $('#loadmoreExchangelanguage').modal('show')
    var modalloadmoreEx = document.getElementById('loadmoreExchangelanguage')
    var modalloadmoreExBody = modalloadmoreEx.getElementsByClassName('modal-body')[0]

    HTTP_REQUEST('/languageex/user/loadexchange', 'POST', {}, function(err, data){
        if(err) alert(err)
        else{
          HTTP_REQUEST("/languageex/user/loaddegree", 'GET', {}, function(err1, data1){
            if(err1) alert(err1)

            var Ele = ''
            Ele += '<table class="table table-striped"><thead><tr>'+
                '<th>Stt</th><th>Tên</th><th>Trình độ</th><th>Đang trao đổi</th></tr></thead>'

            for(var ind = 0; ind < data.result.ex.length; ind++){
                var isprio = ""
                if(parseInt(data.result.ex[ind].prio) == 1)   isprio = "checked"

                Ele += '<tr><td>'+(ind+1)+'</td><td>'+data.result.ex[ind].exname+'</td>'+
                '<td>'+data.result.ex[ind].dename+'</td>'+
                '<td><div class="radio"><label><input type="radio" value="'+data.result.ex[ind].symbol+'"'+
                  ' name="changeprio" '+isprio+' id="'+data.result.ex[ind].lgid+'"'+
                ' onclick="changePrioEx('+data.result.ex[ind].lgid+',\''+data.result.ex[ind].symbol+'\')"></label></div></td>'+
                '</tr>'
            }
            Ele += '</table>'
            
            if(data.result.ex.length < 4){
                Ele +='<div id="selectmoreexchangehd"><label for="sel1">Thêm ngôn ngữ thực hành:(tối đa 4)</label>'+
                '<select class="form-control" id="selectmoreexchange">'
                for(var i = 0; i < data.result.language.length; i++){
                    var flag = true;
                    for(var ind = 0; ind < data.result.ex.length; ind++){
                        if(data.result.ex[ind].lgid == data.result.language[i].id){
                            flag = false;
                            break;
                        }

                    }
                    if(flag)   Ele +=  '<option value="'+data.result.language[i].id+'">'+data.result.language[i].name+'</option>'
                }
                Ele += '</select></div>'

               
                Ele +='<div id="chooseDegreehidden" style="display:none;"><label for="sel4">Chọn trình độ: </label>'+
                    '<select class="form-control" id="chooseDegree">'
                for(var ind = 0; ind < data1.result.length; ind++){
                    Ele+='<option value="'+data1.result[ind].id+'">'+data1.result[ind].name+'</option>'
                }
                Ele +='</select></div>'
            }else{
                Ele += '<div class="alert alert-danger">'+
                    '<strong>Cảnh báo! </strong> Bạn không thể thêm ngôn ngữ thực hành.'+
                    ' Chúng tôi chỉ cho phép 4 ngôn ngữ trao đổi.'+
                '</div>'
            }

            modalloadmoreExBody.innerHTML = Ele
           
            if(document.getElementById('selectmoreexchange')){
                var LANGID = -1
                document.getElementById('selectmoreexchange').onchange = function(){
                    LANGID = this.options[this.selectedIndex].value
                    document.getElementById("selectmoreexchangehd").style.display = "none"
                    document.getElementById("chooseDegreehidden").style.display = "block"
                }

                document.getElementById('chooseDegree').onchange = function(){
                    var deid = this.options[this.selectedIndex].value
                    if(LANGID > -1){
                        HTTP_REQUEST("/languageex/user/addex", 'POST', {lgid:LANGID, deid: deid, time: new Date()}, 
                        function(err, data){
                            if(err) alert(err)
                            alert("Add successed.")
                            location.reload()
                        })
                    }
                }
            }

          })
        }
    })
}


var changePrioEx = function(lgid, symbol){
    if(MYPRIOEX != symbol){
        HTTP_REQUEST("/languageex/user/changemissprio", 'PUT', {data:lgid}, function(err, data){
            if(err) alert(err)
            alert("Change successed.")
            location.reload()
        })
    }
}


var addMoreNative = function(id){
    $('#loadmoreNativelanguage').modal('show')
    var modalloadmoreNat = document.getElementById('loadmoreNativelanguage')
    var modalloadmoreNatBody = modalloadmoreNat.getElementsByClassName('modal-body')[0]

    HTTP_REQUEST('/languageex/user/loadnative', 'POST', {}, function(err, data){
        if(err) alert(err)
        else{
            var Ele = ""
            Ele += '<table class="table table-striped"><thead><tr>'+
                '<th>Stt</th><th>Tên</th><th>Chọn</th></tr></thead>'

            for(var ind = 0; ind < data.result.nat.length; ind++){
                var isprio = ""
                if(data.result.nat[ind].prio > 0)
                    isprio = "checked"
                Ele += '<tr><td>'+(ind+1)+'</td><td>'+data.result.nat[ind].natname+'</td>'+
                '<td><div class="radio"><label><input type="radio" value = "'+data.result.nat[ind].symbol+'"'+
                      'id="'+data.result.nat[ind].lgid+'" name="changeprio" '+isprio+
                      ' onclick="changePrioNat('+data.result.nat[ind].lgid+',\''+data.result.nat[ind].symbol+'\')"></label></div></td>'+
                '</tr>'
            }
            Ele += '</table>'

            if(data.result.nat.length < 3){
                Ele +='<label for="sel1">Thêm ngôn ngữ tự nhiên:(tối đa 3)</label>'+
                '<select class="form-control" id="selectmorenative">'
                for(var i = 0; i < data.result.language.length; i++){
                    var flag = true;
                    for(var ind = 0; ind < data.result.nat.length; ind++){
                        if(data.result.nat[ind].lgid == data.result.language[i].id){
                            flag = false;
                            break;
                        }

                    }
                    if(flag)   Ele +=  '<option value="'+data.result.language[i].id+'">'+data.result.language[i].name+'</option>'
                }
                Ele += '</select>'
            }else{
                Ele += '<div class="alert alert-danger">'+
                    '<strong>Danger!</strong>Bạn không thể thêm ngôn ngữ tự nhiên.'+
                    ' Chúng tôi chỉ cho phép 3 ngôn ngữ tự nhiên.'+
                '</div>'
            }

            modalloadmoreNatBody.innerHTML = Ele

            document.getElementById('selectmorenative').onchange = function(event){
               var languageid = this.options[this.selectedIndex].value
               HTTP_REQUEST("/languageex/user/addnat", 'POST', {lgid:languageid, time: new Date()}, 
                 function(err, data){
                    if(err) alert(err)
                    alert("Add successed.")
                    location.reload()
                })
            }
        }
    })
}

var changePrioNat = function(lgid, symbol){
    if(MYPRIONAT != symbol){
        HTTP_REQUEST("/languageex/user/changetrasprio", 'PUT', {data:lgid}, function(err, data){
            if(err) alert(err)
            alert("Change successed.")
            location.reload()
        })
    }
}


var editInformation = function(id){
    $('#EditinforUser').modal('show')
}


document.getElementById("ChangePassword").onclick = function(){
    var divchangepass = document.getElementById("DivChangePassword")
    divchangepass.style.display = "block"
    document.getElementById("ChangePassword").style.display = "none"
    document.forms["myForm"].style.display = "none"
    document.getElementById("submitform").style.display = "none"
    document.getElementById("changepassuser").style.display="block"
}


document.getElementById("pwd").onchange = function(){
    /**
        /^
            (?=.*\d)          // should contain at least one digit
            (?=.*[a-z])       // should contain at least one lower case
            (?=.*[A-Z])       // should contain at least one upper case
            [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters

        $/
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    
    **/
    //toi thieu 6 ki tu, toi thieu 1 ki tu chu, cac ki tu phai la a,b,c va ki tu so
    var regex =/^(?=.*[a-zA-Z])[0-9a-zA-Z]{6,}$/  
        
    var password = document.getElementById("pwd").value
    var validatenotify = document.getElementById("password")
    validatenotify.innerHTML = ""
    validatenotify.style.display = "block"
    if(password == "")
        validatenotify.innerHTML = "**) Do not empty this field."
    else if(password.length < 6)
        validatenotify.innerHTML = "**) Password length not match (length >= 6)."
    else if(!regex.test(password)){
        validatenotify.innerHTML = "**) Password at least have 1 alphabet, minlenght > 6."
    }else{
        HTTP_REQUEST('/languageex/user/checkpass', 'POST', {pass: password}, function(err, data){
            if(err) alert(err)
            else{
                console.log(data)
                if(data.result == 110001)
                  validatenotify.innerHTML = "**) Password not match."
            }
        })
    }

}

document.getElementById("npwd").onchange = function(){
    var oldpass = document.getElementById("pwd").value
    var password = document.getElementById("npwd").value
    var validatenotify = document.getElementById("newpassword")
    var regex =/^(?=.*[a-zA-Z])[0-9a-zA-Z]{6,}$/  
    validatenotify.innerHTML = ""
    validatenotify.style.display = "block"
    if(password == ""){
        validatenotify.innerHTML = "**) Do not empty this field."
    }else if(oldpass == password){
         validatenotify.innerHTML = "**) This is old password." 
    }else if(!regex.test(password))
        validatenotify.innerHTML = "**) Password at least have 1 alphabet, minlenght > 6."
}

document.getElementById("cpwd").onchange = function(){
    var password = document.getElementById("cpwd").value
    var npassword = document.getElementById("npwd").value
    var validatenotify = document.getElementById("confirmpassword")

    validatenotify.innerHTML = ""
    validatenotify.style.display = "block"
    if(npassword == ""){
        validatenotify.innerHTML = "**) Do not empty this field."
    }else if(password != npassword)
        validatenotify.innerHTML = "**) Confirm password not match."
}

//submit change password
document.getElementById("changepassuser").onclick = function(){
    var opassword = document.getElementById("npwd").value
    var password = document.getElementById("pwd").value
    var npassword = document.getElementById("cpwd").value

    var validatenotify = document.getElementById("password")
    var validatenotifynp = document.getElementById("newpassword")
    var validatenotifycp = document.getElementById("confirmpassword")
    var valid = true;

    if(opassword == "" || password == "" || npassword == ""){
        alert("One in three field emplty.")
        valid = false;
        return false;
    }

    if(validatenotify.innerHTML != "" || validatenotifynp.innerHTML != "" ||
        validatenotifycp.innerHTML != ""){
            alert("Not valid in one of three field.")
            valid = false;
            return false;
    }

    if(valid){
        HTTP_REQUEST('/languageex/user/changepass', 'POST', {npass: npassword}, function(err, data){
            if(err) alert(err)
            else{
                if(data.result == 110001)
                   alert("Can not change your password. Please try again.")
                else{
                   alert("Change password successed") 
                   location.reload()
                }
            }
        })
    }

}

function validateForm() {
    var oldname = myinformation.infor.name
    var olddateofbirth = myinformation.infor.dateofbirth1
    var oldgender = myinformation.infor.gender
    var olddescribe = myinformation.infor.describe

    var nname =  document.forms["myForm"]["name"].value;
    var ndateofbirth = document.forms["myForm"]["bday"].value;
    var ngender = document.forms["myForm"]["gender"].value;
    var ndescribe = document.forms["myForm"]["describe"].value;

    if(nname == oldname && olddescribe == ndescribe && oldgender == ngender 
        && ndateofbirth == olddateofbirth){
        alert("No information is edited.")
        document.forms["myForm"]["name"].focus()
        return false;
    }

    var validatedescribe = /^[A-Za-z0-9 _,.:']+$/.test(ndescribe);//validate describe
    if(!validatedescribe){
        alert("Your descibe must be only contains characters and numbers and some special characters.");
        document.forms["myForm"]["describe"].focus()
        return false;
    }

   
}