
var fs = require('fs');

//tao thu muc chua anh dai dien voi tham so dau vao la ma nguoi dung
function Create_directory(path, id, cb)
{
	try{
		var create_directory = path + '/' + id;
		fs.mkdirSync(create_directory)
		cb('Da tao thanh cong thu muc co chua id: ' + id, null)
	}catch(err)
	{
		if(err.code == 'EEXIST')
			cb('Thu muc: ' + create_directory + ' da ton tai. Khong can tao.', null)
		else
			cb(null, err)
	}
}

//xoa thu muc chua anh dai dien voi tham so dau vao la ma nguoi dung
function Delete_file_in_directory(path, id)
{
	var del_directory = path + '/' + id;
  	if(fs.existsSync(del_directory))
    {
    	fs.readdirSync(del_directory).forEach(function(file, index){//de quy xoa file trong thu muc
      		var curPath = del_directory + "/" + file;
      		if(fs.lstatSync(curPath).isDirectory()) { // recurse
        		Delete_file_in_directory(curPath)
      		}else{ // delete file
        		  fs.unlinkSync(curPath);
      		}
    	});
    //	fs.rmdirSync(del_directory);
  	}
}

module.exports = {
    Create_directory: Create_directory,
    Delete_file_in_directory: Delete_file_in_directory
}