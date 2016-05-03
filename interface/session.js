var express = require('express');
var app = express();
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var response = require('../common/response');

var userService = require('../service/userService');
// var functionService = require('../service/functionService');
var menuService = require('../service/menuService');
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
        var rtn = response.OK;
        rtn.values = session.usersobj!=null;
        callback(rtn);
}
module.exports.sessionExist = session_sessionExist;

var session_cleanSession = function(callback){
	expressSession.usersobj = null;
        var rtn = response.OK;
        rtn.values = (expressSession.usersobj==null);
        callback(rtn);
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

var session_getMenu = function(funObj,callback){
	menuService.getMenu(funObj,function(data) {
        var rtn = response.OK;
        rtn.values = data;
        callback(rtn);
	});
};
module.exports.getMenu = session_getMenu;

var session_getMenuByUser = function(userobj,callback){
	menuService.getMenuByUser(userobj,function(data) {
        var rtn = response.OK;
        rtn.values = data;
        callback(rtn);
	});
};
module.exports.getMenuByUser = session_getMenuByUser;

var session_setMenuCrud = function (userobj,funobj,callback) {
	userService.setMenuCrud(userobj,funobj,function (data) {
		callback(data);
	});
};
module.exports.setMenuCrud = session_setMenuCrud;

var session_setUserRole = function (userobj,roleIdAry,callback) {
	roleService.getRoleById(roleIdAry,function (roleDate) {
		console.log("roleDate="+roleDate.values);
		console.log("roleDate_id="+roleDate.values._id);
		console.log("userobj="+userobj.values[0]);
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