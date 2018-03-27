


var callVideo = function(id){
	$('#callvideoStream').modal('show')
	$('#callvideoStream').modal({backdrop: 'static', keyboard: false})  
}



$('#callvideoStream').on('hidden.bs.modal', function() {
	video.pause();
	video.src = ""
    localstream.stop();//tat camera
})



var video  = document.querySelector('#recordingAudiovideo');
var localstream, Interval, TINTERVAL = 1000;
var msgRecord = function(id){

	$('#recordingAudio').modal('show')
	$('#recordingAudio').modal({backdrop: 'static', keyboard: false})  

	//nguoi dung muon tiep tuc ghi am
	document.getElementById("restartrecordingAudio").style.display = "none";
	document.getElementById("startrecordingAudio").style.display = "block";

	var recording = document.getElementById('recordingAudio').getElementsByClassName('glyphicon glyphicon-volume-up')[0]
	var Interval = setInterval(function(){
		if(recording.style.color == "blue")
			recording.style.color = "red";
		else 
			recording.style.color = "blue";
	}, TINTERVAL)

 	function successCallback(stream) {
		// RecordRTC usage goes here
		var options = {type: 'audio'};
		recordRTC = RecordRTC(stream, options);
		recordRTC.startRecording();
	}
 
	function errorCallback(error) {
			// maybe another application is using the device
		console.log(error)
	}

	var mediaConstraints = { audio: true };
	navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);

	// Get access to the camera!
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// Not adding `{ audio: true }` since we only want video now
		navigator.mediaDevices.getUserMedia({ video: true, audio: true}).then(function(stream) {
			video.srcObject = stream;
		    localstream = stream
			video.play();
		});
	}


	var btnStopRecording = document.querySelector('#stoprecordingAudio');
	btnStopRecording.onclick = function()
	{
		video.pause();
		video.src = ""
		document.getElementById("restartrecordingAudio").style.display = "block";
		document.getElementById("startrecordingAudio").style.display = "none";
		localstream.stop();//tat camera
		
		recordRTC.stopRecording(function (audioVideoWebMURL) {
			video1.style.display = "block"
			video1.src = audioVideoWebMURL;
			var recordedBlob = recordRTC.getBlob();
		});
	};

	var btnDoneRecording = document.querySelector('#donerecordingAudio');
	btnDoneRecording.onclick = function()
	{
		recordRTC.getDataURL(function(dataURL) {
		 
        	var message = {}
        	message.data = dataURL
        	message.content = null
        	message.edit = []//khoi tao rong
        	var time = formatAMPM(new Date());
        	Message_send(id, time, MYPHOTO, message, 0)

			socket.emit('sendrecording', {
				content: message,
				time: new Date(),
            	myid: MYID,
            	photo: MYPHOTO,
            	pid: id
			})
		});

		$('#recordingAudio').modal('hide')
		video1.pause();
		video1.src = ""
		clearInterval(Interval);
	}	

	$('#recordingAudio').on('hidden.bs.modal', function() {
		video.pause();
		video.src = ""
    	localstream.stop();//tat camera
    	recordRTC.stopRecording();
    	clearInterval(Interval);
	})
}

//bat su kien da xem tin nhan
socket.on('receiverecording',function(data)
{
	Message_receiver(data.myid, data.time, data.photo, data.content, 0)

	$('#'+data.myid+'_mymsg').on("focus", function(){
        socket.emit('isseemsg', { myid: MYID, pid: data.myid })
    })
})
