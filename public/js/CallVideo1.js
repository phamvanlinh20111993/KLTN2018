
//người dùng bat dau goi video bang ham này
var callVideoOneToOne = function(id, name, photo){
	window.open("/languageex/user/callvideo?sender="+MYID);
	var userinfo = {name: MYEMAIL, photo: MYPHOTO}  
	socket.emit('signalcallvideo', {myid: MYID, pid: id, info:userinfo, code: "call"})//gui tin hieu
}


var audio1 = new Audio('/data/sound/nhacchuong1.mp3')
var body = document.getElementById('acceptCallvideoFromuser').getElementsByClassName('modal-body')[0]
var button_modal_accept = body.getElementsByTagName('button')[0]//chap nhan cuoc goi
var button_modal_refuse = body.getElementsByTagName('button')[1]//tu choi cuoc goi

//đối tác nhận tín hiệu gọi video
socket.on('receivesignalcallvideo', function(data)//nhan tin hieu
{
	if(MYID == data.pid){//tim dung nguoi nhan
		audio1.play();
		body_image = body.getElementsByTagName("img")[0]
		body_image.src = data.info.photo
		body_tagp = body.getElementsByTagName("p")[0]
		body_tagp.innerHTML = "Email <span style='font-style:italic;font-size:110%;color:red;'>"+data.info.name+"</span> want to connect with you..."

		$('#acceptCallvideoFromuser').modal('show')

		//chap nhan cuoc goi
		button_modal_accept.onclick = function()
		{
			$('#acceptCallvideoFromuser').modal('hide')
			//socket.emit('createroomchat', {myid: MYID, pid: data.myid})//tham gia room chat
			socket.emit('acceptcallvideo', {myid: MYID, pid: data.myid})
			audio1.pause();
			window.open("/languageex/user/callvideo?receiver="+data.pid);
		}

		//tu choi cuoc goi
		button_modal_refuse.onclick = function(){
			audio1.pause();
		//	socket.emit('refusecall', {myid: MYID, pid:data.myid})
		}
	}
})