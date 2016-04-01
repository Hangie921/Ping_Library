//--DEFINE---
var usersobj = require('../bean/users');


//--PUBLIC FUNCTION---
var fun_getUser = function(obj,callback){
	usersobj.find({
		system_parameter:obj.system_parameter,
		email : obj.email,
		pwd: obj.pwd
	}, function(err, obj) {
	  if (err) throw err;
	  callback(null,obj);
	});
}

//--PUBLIC FUNCTION---
var fun_registered = function(obj,callback){
	usersobj.findOne({
		system_parameter:obj.system_parameter,
		email : obj.email
	}, function(err, data) {
	  if (err) throw err;

	  if(null==data){
	  	obj.save(function(err) {
	  		if (err) throw err;
	  		callback(null,obj);
	  	});
	  }else{
	  	callback(null,null);
	  }
	});
}

//--PUBLIC FUNCTION---
var fun_emailCheck = function(obj,callback){
	usersobj.findOne({
		system_parameter:obj.system_parameter,
		email : obj.email
	}, function(err, data) {
	  	if (err) throw err;
		callback(err,null!=data);
	});
}


//--EXPORT---
exports.getUser = fun_getUser;
exports.registered = fun_registered;
exports.emailCheck = fun_emailCheck;