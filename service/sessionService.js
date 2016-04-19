var async = require('async');
var userService = require('./userService');
// var functionService = require('./functionService');
var menuService = require('./menuService');
var roleService = require('./roleService');

var usersobj = require('../bean/users');
var response = require('../common/response');

//--PUBLIC FUNCTION---
var session_login = function(req, res, obj, callbackUser) {
    userService.getUser(obj, function(data) {
        if (data.code === 200) {
            async.series({
                user: function(callback) {
                    req.session.user = data.values;
                    try {
                        delete data.values.pwd;
                    } catch (e) {
                        console.log(e);
                    }
                    callback();
                },
                func: function(callback) {
                    //取得user的menu(這個method取了第二次的USER TODO)
                    menuService.getMenuByUser(obj, function(menu_data) {
                        req.session.menu = menu_data;

                    	callback();
                    });
                }

            }, function(err, results) {
        		callbackUser(data);
            });
        } else {
            req.session.user = null;
            req.session.menu = null;
            callbackUser(data);
        }

    });
}

var session_getUserSession = function(req, res, callback) {
    try {
        if (req.session.user === null) {
            callback(response.obj(response.codeEnum.Not_Found, null));
        } else {
            callback(response.obj(response.codeEnum.OK, req.session.user));
        }
    } catch (e) {
        callback(response.obj(response.codeEnum.Not_Found, null));
    }
}

var session_getMenuSession = function(req, res, callback) {
    try {
    	// console.log("session_getMenuSession>>>>>"+req.session.menu);
        if (req.session.menu === null) {
            callback(response.obj(response.codeEnum.Not_Found, null));
        } else {
            callback(response.obj(response.codeEnum.OK, req.session.menu));
        }
    } catch (e) {
        callback(response.obj(response.codeEnum.Not_Found, null));
    }
}


var session_cleanUserSession = function(req, res, callback) {
    try {
        req.session.user = null;
        req.session.menu = null;
        callback(response.obj(response.codeEnum.OK, req.session.user));
    } catch (e) {
        callback(response.obj(response.codeEnum.Not_Found, null));
    }
}


exports.login = session_login;
exports.getUserSession = session_getUserSession;
exports.getMenuSession = session_getMenuSession;
exports.cleanUserSession = session_cleanUserSession;
