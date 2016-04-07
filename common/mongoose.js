var mongoose = require("mongoose");
mongoose.connect('mongodb://192.168.60.65/test')


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
//source original: http://www.askdaima.com/question/da484766dbe70dcb
// mongoose.connection.on('error', function(err) {
//   console.log("Error while connecting to MongoDB:  " + err);
//   process.exit();
// });
// mongoose.connection.on('connected', function(err) {
//   console.log('mongoose is now connected');
//   // start app here
//   http.createServer(app).listen(app.get('port'), function(){
//     console.log('Express server listening on port ' + app.get('port'));
//   });
// });

module.exports = mongoose;