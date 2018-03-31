

//$('#acceptCallvideoFromuser').modal('show')

var videocall = document.getElementById('callingvideoStream')
var localstream1;
var peer = new Peer({key: 's0xuhlvq9g2satt9'});
var audio = new Audio('/data/sound/gagay.mp3');

peer.on('open', function(){
    console.log("myidcallvideo "+peer.id)
});

//goi nguoi dung
var body_modal = document.getElementById("callvideoStream").getElementsByClassName("modal-body")[0]
var showcalling = document.getElementById("showcalling")
var videochatcalling = document.getElementById("videochatcalling")
var MAX_TIMECALL = 10000, TIMEDYNAMIX = 1000
var timeoutcall;//set thoi gian goi sau n thoi gian khong tra loi thi dong cuoc goi

var callVideoOneToOne = function(id, name, photo)
{
	//$('#callvideoStream').modal('show');
	$('#callvideoStream').modal({backdrop: 'static', keyboard: false})

	var userinfo = {name: MYEMAIL, photo: MYPHOTO}  
	socket.emit('sendcallvideocode', {myid: MYID, pid: id, info:userinfo, code: peer.id})//gui tin hieu

	var span_body_modal = body_modal.getElementsByClassName("glyphicon glyphicon-earphone")[0]
	audio.play(); 
    audio.volume = 1.0
	var imagedynamic = setInterval(function(){
		audio.loop = true; 
		if(span_body_modal.style.color == "blue")
			span_body_modal.style.color = "red"
		else
			span_body_modal.style.color = "blue"
	}, TIMEDYNAMIX)

	//sau 60s thi ket thuc cuoc goi
	Close(id)

	var timeoutcall = setTimeout(function(){
		audio.pause()
		$('#callvideoStream').modal('hide');
		clearInterval(imagedynamic);
	}, MAX_TIMECALL)
	
}

var body = document.getElementById('acceptCallvideoFromuser').getElementsByClassName('modal-body')[0]
var button_modal_accept = body.getElementsByTagName('button')[0]//chap nhan cuoc goi
var button_modal_refuse = body.getElementsByTagName('button')[1]//tu choi cuoc goi

var audio1 = new Audio('/data/sound/nhacchuong1.mp3')
socket.on('receivecallvideocode', function(data)//nhan tin hieu
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
			socket.emit('createroomchat', {myid: MYID, pid: data.myid})//tham gia room chat
			audio1.pause();
			$('#acceptCallvideoFromuser').modal('hide')
 			$('#callvideoStream').modal('show')

 			videochatcalling.style.display = "block"
 			showcalling.style.display = "none"

 			var userinfo = {name: MYEMAIL, photo: MYPHOTO}  
      		socket.emit('acceptcall', {myid: MYID, pid:data.myid, info:userinfo, code: peer.id})

   			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
   			navigator.getUserMedia({video: true, audio: true}, function(stream)
	 		{
  				var call = peer.call(data.code, stream);
  				call.on('stream', function(remoteStream) {
    				// Show stream in some video/canvas element.
    				videocall.srcObject = remoteStream
    				localstream1 = remoteStream
    				videocall.play()
  				});
			}, function(err) {
  				console.log('Failed to get local stream' ,err);
			});
		}

		//tu choi cuoc goi
		button_modal_refuse.onclick = function(){
			audio1.pause();
			socket.emit('refusecall', {myid: MYID, pid:data.myid})
			$('#acceptCallvideoFromuser').modal('hide')
		}

		Close(data.myid)
	}
})

function Close(id){
	$('#callvideoStream').on('hidden.bs.modal', function() {
		videochatcalling.style.display = "none"
 		showcalling.style.display = "block"

		if(localstream1){
			videocall.pause();
			if(audio)
				audio.pause();
			if(audio1)
				audio1.pause()
			
			videocall.src = ""
    		localstream1.stop();//tat camera
    		socket.emit('endcall', {myid: MYID, pid: id})

    		console.log('ket thuc cuoc gọi')
  			peer.on('close', function(call){
  				console.log("end " + call)
    		})
   		//	peer.id = null
   		}
   	})
}


socket.on('calling', function(data)
{
	videochatcalling.style.display = "block"
 	showcalling.style.display = "none"
 	clearTimeout(timeoutcall);

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	peer.on('call', function(call){

  		navigator.getUserMedia({video: true, audio: true}, function(stream) {
    		call.answer(stream); // Answer the call with an A/V stream.
    			call.on('stream', function(remoteStream) {
           		// Show stream in some video/canvas element.
           		videocall.srcObject = remoteStream
           		localstream1 = remoteStream
           		videocall.play()
    		});
  		}, function(err) {
   			console.log('Failed to get local stream' ,err);
  		});
	});

})


socket.on('doneendcall', function(data){
	videocall.pause();
	videocall.src = ""
    localstream1.stop();//tat camera
  //  peer.id = null
    console.log("gui tin hieu "+data.toString())
    peer.on('close', function(call){
    	console.log("ket thuc " + call)
    })
})

//nguoi dung tu choi cuoc goi
socket.on('donerefusecall', function(data){
	if(MYID == data.myid){
		audio.pause();
		videochatcalling.style.display = "none"
 		showcalling.style.display = "block"
 		$('#callvideoStream').modal('hide')
 	}
})
