var express = require('express');
var session = require('express-session');
var response = require('../common/response');

var userService = require('../service/userService');
var functionService = require('../service/functionService');
var roleService = require('../service/roleService');

var session_registered = function(usersobj,callback){
	userService.registered(usersobj,function (data) {
		callback(data);
	});

}
module.exports.registered = session_registered;

var session_sessionExist = function(callback){
	callback(response.obj(response.codeEnum.OK,session.usersobj!=null));
}
module.exports.sessionExist = session_sessionExist;

var session_cleanSession = function(callback){
	session.usersobj = null;
	callback(response.obj(response.codeEnum.OK,(session.usersobj==null)));
}
module.exports.cleanSession = session_cleanSession;

var session_getUser = function(usersobj,callback){
	userService.getUser(usersobj,function (data) {
		callback(data);
	});
}
module.exports.getUser = session_getUser;

var session_setUser = function(usersobj,callback){
	session.usersobj = usersobj;
}
module.exports.setUser = session_setUser;

var session_login = function(usersobj,callback){
	userService.getUser(usersobj,function (data) {
		callback(data);
	});
}
module.exports.login = session_login;

var session_forgot = function(usersobj,callback){
	userService.emailCheck(usersobj,function (data) {
		callback(data);
	});
}
module.exports.forgot = session_forgot;

//-----需實作，未完成----
var session_getRoleBySys = function(sys_parameter,callback){
		roleService.getRole(sys_parameter,function(data) {
	});
};
module.exports.getRoleBySys = session_getRoleBySys;

var session_getRoleByUser = function(userObj,callback){
	userService.getUser(userObj, function (data) {
	  // console.log(data.values);
	  roleService.getRoleByUser(data,function (data2) {
	    callback(data2);
	  });
	});
};
module.exports.getRoleByUser = session_getRoleByUser;

var session_getFunction = function(funObj,callback){
	functionService.getFunction(funObj,function(data) {
		callback(response.obj(response.codeEnum.OK,data));
	});
};
module.exports.getFunction = session_getFunction;

var session_getFunctionByUser = function(userobj,callback){
	// functionService.fun_getFunctionByUser(userobj,function(data) {
	// 	callback(response.obj(response.codeEnum.OK,data));
	// });
};
module.exports.getFunctionByUser = session_getFunctionByUser;


// var session_throwError = function(callback){
// 	throw new Error(123);
// }
// module.exports.throwError = session_throwError;