var express = require('express');
var session = require('express-session');

var userService = require('../service/userService');

var session_registered = function(usersobj,callback){
	userService.registered(usersobj,function (err,data) {
		callback(null,null!=data);
	});

}
module.exports.registered = session_registered;

var session_sessionExist = function(callback){
	callback(null,session.usersobj!=null);
}
module.exports.sessionExist = session_sessionExist;

var session_cleanSession = function(callback){
	session.usersobj = null;
	callback(null,session.usersobj==null);
}
module.exports.cleanSession = session_cleanSession;

var session_getUser = function(usersobj,callback){
	userService.getUser(usersobj,function (err,data) {
		callback(null,data);
	});
}
module.exports.getUser = session_getUser;

var session_setUser = function(usersobj,callback){
	session.usersobj = usersobj;
}
module.exports.setUser = session_setUser;

var session_login = function(usersobj,callback){
	//判斷session USER是否存在
	userService.getUser(usersobj,function (err,data) {
		if(null!=data){
			//寫入session
			session.usersobj = data;
			callback(null,data);
		}else{
			callback(null,null);
		}
	});
}
module.exports.login = session_login;

var session_forgot = function(usersobj,callback){
	//判斷EMAIL是否存在
	userService.emailCheck(usersobj,function (err,data) {
		callback(err,data);
	});
}
module.exports.forgot = session_forgot;


// var session_throwError = function(callback){
// 	throw new Error(123);
// }
// module.exports.throwError = session_throwError;