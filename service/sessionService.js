var userService = require('./userService');
var functionService = require('./functionService');
var roleService = require('./roleService');

var usersobj = require('../bean/users');
var response = require('../common/response');

//--PUBLIC FUNCTION---
var session_getUser = function(req,res,obj,callback){
	userService.getUser(obj,function (data) {
		req.session.user = data.values;
		callback(data);
	});
}
exports.getUser = session_getUser;

var session_getUserSession = function(req,res,callback){
	try{
		callback(response.obj(response.codeEnum.OK,req.session.user));
	}catch(e){
	  	callback(response.obj(response.codeEnum.Not_Found,null));
	}
}
exports.getUserSession = session_getUserSession;


var session_cleanUserSession = function(req,res,callback){
	try{
		req.session.user = null;
		callback(response.obj(response.codeEnum.OK,req.session.user));
	}catch(e){
	  	callback(response.obj(response.codeEnum.Not_Found,null));
	}
}
exports.cleanUserSession = session_cleanUserSession;

