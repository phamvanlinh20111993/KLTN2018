var express = require('express')
var app = express()//su dung
var bodyParser = require('body-parser')//Đây là một lớp trung gian node.js để xử lí JSON, dự liệu thô, text và mã hóa URL.
var server = require('http').createServer(app) 
var io = require('socket.io')(server);
var morgan = require('morgan') //log/show request and response from client/server
var md5 = require('md5') // su dung md5 ma hoa pass
var path = require('path')
var session = require('express-session')//bat session luu tru thong tin trong phien lam viec
var cookieParser = require('cookie-parser')//su dung cookie trong nodejs
var flash = require('connect-flash')//chuong trinh bi loi req.flash is not a funtion,
var passport = require('passport')
var mysql = require('mysql');
var cloudinary = require('cloudinary')
var engines = require('consolidate');

var port = process.env.PORT||5050;
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))//limit data transfer from client
app.use(bodyParser.json())

var session = require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 48*3600*1000 }
});//neu de secure:true thi session khong duoc khoi tao???

var sharedsession = require("express-socket.io-session");

// Use express-session middleware for express
app.use(session);

// Use shared session middleware for socket.io
// setting autoSave:true cccc
io.use(sharedsession(session, {autoSave:true})); 

app.use(flash())
app.use(cookieParser())//su dung cookie

app.get('/', function(req, res){
	res.redirect('/languageex/user');
})


app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'view'))
app.set('public', path.join(__dirname, 'public'))
//app.set('private', path.join(__dirname, 'private'))

app.use(express.static(__dirname + '/view'));//su dung cac file tĩnh trong views
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/private'));

app.use(function(req, res, next){
	res.locals.session = req.session;//su dung session trong file client vi du session.name trong file home.ejs
	next();
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "KLTN_ExLanguage",
  charset: "utf8_general_ci"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected Successful in Control App file!");
});
//var connection = mysql.createConnection('mysql://user:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');


//config cloudinary
cloudinary.config({ 
  cloud_name: 'uet', 
  api_key: '992147968271347', 
  api_secret: 'M9TfXOrwtKx0SklY5wOrxPJv-MU' 
});

var login = require('./controller/login_signup/login')
var signup = require('./controller/login_signup/signup')
var publicrq = require('./controller/login_signup/publicrequest');
var registerinfo = require('./controller/login_signup/registerinfo');
var authenticateuser = require('./controller/login_signup/authenticateuser');
var homerq = require('./controller/home/homerequest');
var posts = require('./controller/home/posts')
var community = require('./controller/home/community')
var messenger = require('./controller/home/messenger')
var filter = require('./controller/filter')
//var admin = require('./controller/admin')

app.use('/languageex', publicrq)
app.use('/languageex', login)
app.use('/languageex', signup)
app.use('/languageex', registerinfo)
app.use('/languageex', authenticateuser)
app.use('/languageex', homerq)
app.use('/languageex', posts)
app.use('/languageex', filter)
app.use('/languageex', community)
app.use('/languageex', messenger)


const translate = require('google-translate-api');

var userOnorOffline_id = [];//dia chi email
var index = 0, flag = false;
var TIME_OFFLINE = 8000;
var anotherQuery = require('./model/Anotherquery')


io.on('connection', function(client)
{
	console.log('Client connected ' + client.id);

	client.on('notifyOnline', function(id){//tham so data la email cua nguoi dung

    	client.handshake.session.uid = id;
      client.handshake.session.save();

      flag = false;

    	for(index = 0; index < userOnorOffline_id.length; index ++){
        	if(userOnorOffline_id[index] == id){
	     		io.to(client.handshake.session.community).emit('numofuseronline',  client.handshake.session.numOn)
          	flag = true;
          	break;
        	}
      }

      if(!flag){

         client.handshake.session.numOn = 0;
         client.handshake.session.community = client.handshake.session.uid;
         //add to array
         userOnorOffline_id[userOnorOffline_id.length] = client.handshake.session.id;
         client.handshake.session.save();

         var sqlString = "UPDATE User SET state = 1 WHERE id = " + mysql.escape(client.handshake.session.uid)
         con.query(sqlString, function(err, result, fields){
            if(err) throw err;
            else{
               console.log(result.affectedRows + " record(s) updated online.");
               anotherQuery.selectListUsermyCommunityEx(client.handshake.session.uid, function(data){
                  var index = 0
                  for(index = 0; index < data.length; index++){
                     if(data[index].state == 1)
                        client.handshake.session.numOn++;
                     client.handshake.session.community += data[index].id
                  }
                  client.handshake.session.save();

                  console.log("my community room " + client.handshake.session.community)
                  client.join(client.handshake.session.community)
                  io.to(client.handshake.session.community).emit('numofuseronline', client.handshake.session.numOn)
               })
            }
         })
      }

   })


	client.on('disconnect', function(){
		console.log("User code id = " + client.handshake.session.uid + " offline.")
   
      for(index = 0; index < userOnorOffline_id.length; index++){
         if(client.handshake.session.uid == userOnorOffline_id[index]){
            userOnorOffline_id.splice(index, 1)
            break;
         }
      }

      if(client.handshake.session.uid){
         var sqlString = "UPDATE User SET state = 0 WHERE id = " + mysql.escape(client.handshake.session.uid)
         con.query(sqlString, function(err, result, fields){
            if(err) throw err;
            else{
               client.handshake.session.numOn--;
               io.to(client.handshake.session.community).emit('numofuseronline', client.handshake.session.numOn)
               //io.sockets.in(client.handshake.session.community).emit('numofuseronline', client.handshake.session.numOn)
               console.log(result.affectedRows + " record(s) updated offline.");

               client.leave(client.handshake.session.community);
               client.leave(client.room);

               delete client.handshake.session.community;
               delete client.handshake.session.numOn;
               delete client.handshake.session.uid;
               client.handshake.session.save();
            }
       })
	  }

   })


   client.on('createroomchat', function(data){
      var myid = data.myid;
      var pid = data.partnerid;

      if(myid > pid){
         client.join(myid + pid)
         client.room = myid + pid
      }else{
         client.join(pid + myid)
         client.room = pid + myid
      }
     
      console.log("Da tao room " + client.room)
   })


   client.on('leaveroomchat', function(data){
      client.leave(client.room);
      console.log("Da out room " + client.room)
   })


   //nguoi dung dang nhap tin nhan, báo cho phía bên đối tác: tao đang nhập tin nhắn cho mày
   client.on('chatting', function(data){
      client.in(client.room).emit('typing...', data)//ca 

   })


   client.on('translate', function(data){
      translate(data.content, {from: data.ex, to: data.nat}).then(res => {
         io.sockets.in(client.room).emit('translateddone', {
            uid: data.id,
            translated: res.text,
            error: null
         })
      }).catch(err => {
         console.error(err);
         io.sockets.in(client.room).emit('translateddone', {
            error: err
         })
      });
   })


   client.on('checkmisspellings', function(data)
   {
    //  console.log("from "+data.ex + " to " +  data.nat)
      translate(data.content, {to: data.nat}).then(res => {
            console.log(res);
            console.log(res.text);
            console.log(res.from.text.autoCorrected);
            console.log(res.from.text.value);
            console.log(res.from.text.didYouMean);
           
            io.sockets.in(client.room).emit('checkeddone', {
               checktrue: res.from.text.autoCorrected,
               error: null
            })
         }).catch(err => {
             console.error(err);
             io.sockets.in(client.room).emit('checkeddone',{
               error: err
             })
         });
   })


   client.on('sendmsg', function(data){//nhan tin nhan sau do gui di
      //save in database



      client.in(client.room).emit('receivermsg', { //server gui tin nhan den nguoi nhận
         content: data.content, 
         myphoto: data.photo,
         id_send: data.myid,
         id_receive: data.pid,
         time: data.time
      });
   })


   client.on('isseemsg', function(data){
      client.in(client.room).emit('seen', data)//chi nguoi ben kia thay tin nhan
      //io.sockets.in(client.room)//ca 2 ben deu thay tin nhan
   })
})



server.listen(port, function(){
	console.log('Server dang chay tai cong %s!', port)
});