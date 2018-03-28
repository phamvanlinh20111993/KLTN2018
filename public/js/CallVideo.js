
var callVideoOneToOne = function(id)
{
	$('#callvideoStream').modal('show')
	$('#callvideoStream').modal({backdrop: 'static', keyboard: false})  

	//var Peer = require('simple-peer')

	navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
 //   navigator.getUserMedia({ video: true, audio: true }, gotMedia, function () {})
}

$('#callvideoStream').on('hidden.bs.modal', function() {
	video.pause();
	video.src = ""
    localstream.stop();//tat camera
})

