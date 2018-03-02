const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var App_url = "localhost:5050/languageex/"

function sendMail(email, code, url, type, Callback)
{
	//if(false === (this instanceof sendMail)) {
    //    return new sendMail();
  //  }
    var str = "";
    this.title = "";

    if(type == 0){//authenticate
    	this.title = 'Mã xác thực tài khoản đăng kí Language exchange';
    	str = '<div><div><span style="font-size:150%;color:red;"><i>Chao mung ban da dang nhap vao' 
		str += ' he thong Exchange English Language cua chung toi!!!</i></span></div><div>'
		str += '<p>Ma xac thuc tai khoan cua ban la: </p><b>'+code+'</b></br>'
		str += '<p>Hoac truy cap vao duong dan sau:</p>';
		str += '<a style="color:blue;cursor:pointer;" href="'+App_url+url+'" target="_blank">'+App_url+url+'</a></div></div>'
    }else{
    	this.title = 'Mã xác thực tài khoản người dùng';
   		str = '<div><div><span style="font-size:150%;color:red;"><i>Email của bạn đã được xác thực!!!</i>'
	    str += '</span></div><div><p>Ma xac nhan lai tai khoan cua ban la: </p><b>'+code+'</b></br>';
	    str += '<p>Hoac truy cap vao duong dan sau:</p>';
	    str += '<a style="color:blue;cursor:pointer;" href="'+App_url+url+'">'+App_url+url+'</a></div></div>'
    }

    let transporter = nodemailer.createTransport(smtpTransport({
		service: "Gmail" ,
		auth: {
			user: "duanwebptudweb@gmail.com",
			pass: "DuAnWebPTUDWEB123",
		}
	}));

  	let mailOptions = {
		from: 'duanwebptudweb@gmail.com',
		to: email,//email nguoi dung
		subject:  this.title,
		html: str,
        attachments: [
        {   // utf-8 string as an attachment
            filename: 'license.txt',
            content: App_url+url
        }]
    	
	}

	transporter.sendMail(mailOptions, (error, info)=>{
		if(error)
			Callback(('Some error: '+error), null);
		else
			Callback(null, ('Message '+info.messageId+' sent: '+info.response));
	})
}

sendMail.prototype.sendMailAuthenticate = function(callback){
  	
}

sendMail.prototype.sendMailRecovery = function(callback){
  	
}


module.exports = sendMail;