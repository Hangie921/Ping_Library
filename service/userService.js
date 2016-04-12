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
	  // console.log("rtn_obj is "+rtn_obj);
	  	if(null!=obj && null!=rtn_obj[0] && null!= rtn_obj[0].pwd){
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

//將user function_crud儲存
var fun_setFunctionCrud = function(userobj,funObj,callback){
	usersobj.findById({
		_id:userobj.values[0]._id,
	}, function(err, data) {
	  	if (err) throw err;
	  	if(null!=data){
	  		data.function_crud = funObj;
		  	data.save(function(err) {
		  		if (err) throw err;
		  		callback(response.obj(response.codeEnum.OK,data));
		  	});
	  	}else{
	  		callback(response.obj(response.codeEnum.No_Results,false));
	  	}
	});
}

//將user 增加role
var fun_setUserRole = function(userobj,roleIdAry,callback){
	usersobj.findById({
		_id:userobj.values[0]._id,
	}, function(err, data) {
	  	if (err) throw err;
	  	if(null!=data){
	  		data.role = roleIdAry.values;
		  	data.save(function(err) {
		  		if (err) throw err;
		  		callback(response.obj(response.codeEnum.OK,data));
		  	});
	  	}else{
	  		callback(response.obj(response.codeEnum.No_Results,false));
	  	}
	});
}

//--EXPORT---
exports.getUser = fun_getUser;
exports.registered = fun_registered;
exports.emailCheck = fun_emailCheck;
exports.setFunctionCrud = fun_setFunctionCrud;
exports.setUserRole = fun_setUserRole;