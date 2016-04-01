var express = require('express');
// var wines2 = require('./routes/employee2');
var usersobj = require('./bean/users');
var functionobj = require('./bean/function');
var session = require('express-session');
// var roleobj = require('./bean/role');

var userService = require('./service/userService');
// var roleService = require('./service/roleService');
var funService = require('./service/functionService');
var gengod = require('./common/generate/god');


var sessionManager = require('./interface/session');
 
var app = express();

//-------mongodb setup  start ---------------
var mongoose = require("mongoose");
//set PORT = 3000,set IP = 192.168.60.56,set DBNAME = test
// mongoose.connect("mongodb://"+process.env.IP+":"+process.env.PORT+"/"+process.env.DBNAME);
mongoose.connect("mongodb://192.168.60.65:3000/test");

// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', function() {
    console.log('connected', mongoose.connection.readyState);
});
db.once('disconnected', function() {
    console.log('disconnected', mongoose.connection.readyState);
});
//-------mongodb setup  end ---------------

var assert = require('assert');
var Schema = mongoose.Schema;


// app.get('/employees/:id/reports', wines.findByManager);
// app.get('/employees/:id', wines.findById);
// app.get('/employees', wines.findAll);
// app.post('/employees2/:id/reports', wines2.findByManager);



//http://localhost:3000/employees2?name=j
//http://localhost:3000/employees

//http://localhost:3000/employees/1

//http://localhost:3000/employees/1/reports


//remeber npm install --save body-parser
//http://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters-in-express


//------configure start------------------------

// app.configure(function(){
//   app.set('port', process.env.PORT || 3000);
//   app.set('views', __dirname + '/views');
//   app.set('view engine', 'jade');
//   app.use(express.favicon());
//   app.use(express.logger('dev'));
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(express.static(path.join(__dirname, 'public')));
// });

// app.configure('development', function() {
//   console.log('Using development settings.');
//   app.set('connection', mysql.createConnection({
//     host: '',
//     user: '',
//     port: '',
//     password: ''}));
//   app.use(express.errorHandler());
// });

// app.configure('production', function() {
//   console.log('Using production settings.');
//   app.set('connection', mysql.createConnection({
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT}));
// });

//------configure end--------------------------



var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// app.use(express.multipart());

app.post('/test-page', function(req, res) {
        console.log(req);
});



//攔截錯誤
process.on('uncaughtException', function(err) {
    console.info(err);
    console.error('Error caught in uncaughtException event:', err);
    sessionManager.cleanSession(function (err,data) {});
});

//mytest
// var test = wines2.sys_findMember('1234');

//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications


// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
// mbs001.dudify(function(err, name) {
//   if (err) throw err;
//   console.log('Your new name is ' + name);
// });

//--save
// mbs001.save(function(err) {
//   if (err) throw err;
//   console.log('User saved successfully!');
//});

//--get all the users
//findAll
// memberobj.find({}, function(err, members) {
//   if (err) throw err;
//   // object of all the users
//   console.log(members);
// });

//findOne
// get the user starlord55
// memberobj.find({ firstName: 'Amy' }, function(err, member) {
//   if (err) throw err;
//   // object of the user
//   console.log("findOne="+member);
// });

var god = new usersobj({
  system_parameter: 0,
  email: 'god@ping.com.sg',
  pwd:'!QAZ@WSX'
});

var usrSearch = new usersobj({
  system_parameter: 0,
  email: 'mbs002@ping.com.sg',
  pwd:'ACDE'
});

//呼叫API
// sessionManager.getUser(usrSearch, function (err, data) {
// 	if (err) return console.error(err);
// 	console.log("usrSearch is "+data);
// });

// var roleSearch = new roleobj({
//   system_parameter: 0,
//   email: 'mbs001@ping.com.sg',
//   pwd:'ABCDEFG'
// });

// roleService.getRole(roleSearch,function (err,data) {
// 	if (err) return console.error(err);
	// console.log("roleSearch is "+data);
// });

//var test5 = userService.getMember(mbs005);
//console.log("test5 is "+test5);

//sessionManager test

// sessionManager.registered(usrSearch,function (err,data) {
// 	console.log("registered====>"+data);
// });

sessionManager.login(usrSearch,function (err,data) {
  console.log("login====>"+data);
});

// sessionManager.forgot(usrSearch,function (err,data) {
// 	console.log("forgot====>"+data);
// });

// sessionManager.throwError(function (data) {
  
// });

var userReg = new usersobj({
  system_parameter: 0,
  email: 'mbs010@ping.com.sg',
  pwd:'AAA'
});



// sessionManager.registered(userReg,function (err,data) {
// 	// if(!data){
// 	// 	console.error(err+"||"+data);
// 	// }else{
// 		console.log(err+"@@@"+data);
// 	// }
// });

//sessionManager getManager()
// sessionManager.getMember(usrSearch, function (err, data) {
// 	if (err) return console.error(err);
// 	console.log("usrSearch is "+data);
// });



  // var funObj = new functionobj({
  //     system_parameter: 0,
  //     parent_id : null
  // });

  // funService.getFunction(funObj,function (err,data) {
  //   console.log(data);
  // });




var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s ', host, port);
  console.log('IP:'+process.env.IP);
  console.log('PORT:'+process.env.PORT);
  console.log('DBNAME:'+process.env.DBNAME);

})