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

var port = process.env.PORT||5050;
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))//limit data transfer from client
app.use(bodyParser.json())

app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: false,
	cookie: {maxAge: 24*3600*1000}//neu de secure:true thi session khong duoc khoi tao???
}))

app.use(flash())
app.use(cookieParser())//su dung cookie

app.get('/', function(req, res){
	res.redirect('/languageex/user');
})

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
  charset: "utf8_general_ci"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected!");
});
//var connection = mysql.createConnection('mysql://user:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');

var login = require('./controller/login')
var signup = require('./controller/signup')
var publicrq = require('./controller/publicrequest');
var registerinfo = require('./controller/registerinfo');
var authenticateuser = require('./controller/authenticateuser');
var homerq = require('./controller/homerequest');
var home = require('./controller/home/home')
//var admin = require('./controller/admin')

app.use('/languageex', publicrq)
app.use('/languageex', login)
app.use('/languageex', signup)
app.use('/languageex', registerinfo)
app.use('/languageex', authenticateuser)
app.use('/languageex', homerq)
app.use('/languageex', home)



server.listen(port, function(){
	console.log('Server dang chay tai cong %s!', port)
});