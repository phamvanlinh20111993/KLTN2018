const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')

 var sendMailOption = function(email, title, str){

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
		subject:  title,
		html: str,
         attachments: [
        {   // utf-8 string as an attachment
            filename: 'license.txt',
            content: 'http://localhost:5050/languageex/license'
        }]
    	
	}

	transporter.sendMail(mailOptions, (error, info)=>{
		if(error){
			console.log("Loi nay day: " + error)
			return"Some error: " + error;
		}else{
			//hien thi thong bao gui tin nhan cho nguoi dung
			console.log('Message %s sent: %s', info.messageId, info.response)
			return 'Message '+info.messageId+' sent: ' + info.response;
		}
	})
  }

 var sendMailAuthenticate = function(email, code, id){

	var str = '<div><div><span style="font-size:150%;color:blue;"><i>Chao mung ban da dang nhap vao' 
	str += ' he thong Exchange English Language cua chung toi!!!</i></span></div><div>'
	str += '<p>Ma xac thuc tai khoan cua ban la: </p><b>'+code+'</b></br>'
	str += '<p>Hoac truy cap vao duong dan sau:</p>';
	str += '<a style="color:blue;cursor:pointer;" href="localhost:5050/languageex/'+id+'" target="_blank">localhost:5050/languageex/'+id+'</a></div></div>'

	sendMailOption(email, 'Ma xac thuc tai khoan dang ki Language exchange', str)

}

var sendMailRecovery = function(email, code, id){

	var str = '<div><div><span style="font-size:150%;"><i>Email của bạn đã được xác thực!!!</i>'
	str += '</span></div><div><p>Ma xac nhan lai tai khoan cua ban la: </p><b>'+code+'</b></br>';
	str += '<p>Hoac truy cap vao duong dan sau:</p>';
	str += '<a style="color:blue;cursor:pointer;" href = "localhost:5050/languageex/'+id+'">localhost:5050/languageex/'+id+'</a></div></div>'
	sendMailOption(email, 'Mã xác thực tài khoản người dùng', str)
}

module.exports = {
	sendmailAuthenticate: function(email, code, id){
		sendMailAuthenticate(email, code, id)
	},
	sendmailRecovery: function(email, code, id){
		sendMailRecovery(email, code)
	},
}

