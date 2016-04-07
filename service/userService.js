//--DEFINE---
var usersobj = require('../bean/users');
var response = require('../common/response');


//--PUBLIC FUNCTION---
var fun_getUser = function(obj,callback){
	usersobj.find({
		system_parameter:obj.system_parameter,
		email : obj.email,
		// pwd: obj.pwd
	}, function(err, rtn_obj) {
	  if (err) throw err;
	  	if(null!=obj){
	  		if(rtn_obj[0].pwd == obj.pwd){
	  			callback(response.obj(response.codeEnum.OK,rtn_obj));
	  		}else{
	  			callback(response.obj(response.codeEnum.Password_Error,rtn_obj));
	  		}
	  	}else{
	  		callback(response.obj(response.codeEnum.Bad_Request,'not found'));
	  	}
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
	  		callback(response.obj(response.codeEnum.OK,obj));
	  	});
	  }else{
	  	callback(response.obj(response.codeEnum.Already_Exists,"Already Exists"));
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
	  	if(null!=data){
	  		callback(response.obj(response.codeEnum.OK,true));
	  	}else{
	  		callback(response.obj(response.codeEnum.Not_Found,false));
	  	}
	});
}


//--EXPORT---
exports.getUser = fun_getUser;
exports.registered = fun_registered;
exports.emailCheck = fun_emailCheck;