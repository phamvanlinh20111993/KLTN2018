//su dung socket.io
var socket = io.connect();
//   var socket = io();
			  
socket.on('connect', function(data) {
//ban dau la khi nguoi dung ket noi         
    socket.emit('notifyOnline', myid);//client bao voi server la t online roi
});

socket.on('notifyOnline', function(signal){
	alert(signal)
})