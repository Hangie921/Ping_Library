var express = require('express');
// var gengod = require('../common/generate/god');

var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
// var session      = require('express-session');
// var MongoStore = require('connect-mongo')(session);
var app = express();

var mytest = require('../test/mytest');


app.use(bodyParser());
app.use(cookieParser());



// var mongoose = require("mongoose");
// if (process.argv[2] == '--local') {
//     var url = 'mongodb://localhost/test';
// } else {
//     var url = 'mongodb://192.168.60.65/test';

//     app.use(session({
//         cookie: { maxAge: 1000*60*2 } ,
//         secret: "session secret" ,
//         store:new MongoStore({
//                 db: 'test',
//                 host: '192.168.60.65',
//                 port: 27019,  
//                 // username: 'cm',
//                 // password: 'cm', 
//                 collection: 'session', 
//                 auto_reconnect:true
//         })
//     }));
// }

console.log("connect to " + url);
mongoose.connect(url);

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


var server = app.listen(3000, function() {
    // var host = server.address().address
    // var port = server.address().port
    // console.log('Example app listening at http://%s:%s ', host, port);
    // console.log('IP:'+process.env.IP);
    // console.log('PORT:'+process.env.PORT);
    // console.log('DBNAME:'+process.env.DBNAME);

})
