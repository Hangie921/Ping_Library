var express = require('express');
var app = express();

//---global define
// global.jQuery = require('jquery');

var mytest = require('./test/mytest');


// var bodyParser = require('body-parser')
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 
// app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

// // app.use(express.multipart());

// app.post('/test-page', function(req, res) {
//         console.log(req);
// });



// //攔截錯誤
// process.on('uncaughtException', function(err) {
//     console.info(err);
//     console.error('Error caught in uncaughtException event:', err);
//     sessionManager.cleanSession(function (err,data) {});
// });


var server = app.listen(3000, function () {
  // var host = server.address().address
  // var port = server.address().port
  // console.log('Example app listening at http://%s:%s ', host, port);
  // console.log('IP:'+process.env.IP);
  // console.log('PORT:'+process.env.PORT);
  // console.log('DBNAME:'+process.env.DBNAME);

})