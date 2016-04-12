var express = require('express');
var app = express();
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var response = require('../common/response');

var userService = require('../service/userService');
var functionService = require('../service/functionService');
var roleService = require('../service/roleService');

module.exports = function Sessions(url, secret) {
  // var store = new RedisStore({ url: url });
  // var session = expressSession({
  //   secret: secret,
  //   store: store,
  //   resave: true,
  //   saveUninitialized: true
  // });

  // return session;
};


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
	expressSession.usersobj = null;
	callback(response.obj(response.codeEnum.OK,(expressSession.usersobj==null)));
}
module.exports.cleanSession = session_cleanSession;

var session_getUser = function(usersobj,callback){
	userService.getUser(usersobj,function (data) {
		callback(data);
	});
}
module.exports.getUser = session_getUser;

var session_setUser = function(usersobj,callback){
	expressSession.usersobj = usersobj;
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


var session_getRoleBySys = function(sys_parameter,callback){
		roleService.getRoleBySys(sys_parameter,function(data) {
	});
};
module.exports.getRoleBySys = session_getRoleBySys;

var session_getRoleFunByUser = function(userObj,callback){
	userService.getUser(userObj, function (data) {
	  // console.log(data.values);
	  roleService.getRoleFunByUser(data,function (data2) {
	    callback(data2);
	  });
	});
};
module.exports.getRoleFunByUser = session_getRoleFunByUser;

var session_getFunction = function(funObj,callback){
	functionService.getFunction(funObj,function(data) {
		callback(response.obj(response.codeEnum.OK,data));
	});
};
module.exports.getFunction = session_getFunction;

var session_getFunctionByUser = function(userobj,callback){
	functionService.getFunctionByUser(userobj,function(data) {
		callback(response.obj(response.codeEnum.OK,data));
	});
};
module.exports.getFunctionByUser = session_getFunctionByUser;

var session_setFunctionCrud = function (userobj,funobj,callback) {
	userService.setFunctionCrud(userobj,funobj,function (data) {
		callback(data);
	});
};
module.exports.setFunctionCrud = session_setFunctionCrud;

var session_setUserRole = function (userobj,roleIdAry,callback) {
	roleService.getRoleById(roleIdAry,function (roleDate) {
		console.log("roleDate="+roleDate.values);
		userService.setUserRole(userobj,roleDate,function (data) {
			callback(data);
		});
	});
};
module.exports.setUserRole = session_setUserRole;
// var session_throwError = function(callback){
// 	throw new Error(123);
// }
// module.exports.throwError = session_throwError;