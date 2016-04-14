var userService = require('./userService');
var functionService = require('./functionService');
var roleService = require('./roleService');

var usersobj = require('../bean/users');
var response = require('../common/response');

//--PUBLIC FUNCTION---
var session_login = function(req, res, obj, callback) {
    userService.getUser(obj, function(data) {
        req.session.user = data.code === 200 ? data.values : null;
        try {
            delete data.values.pwd;
        } catch (e) {}
        callback(data);
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


var session_cleanUserSession = function(req, res, callback) {
    try {
        req.session.user = null;
        callback(response.obj(response.codeEnum.OK, req.session.user));
    } catch (e) {
        callback(response.obj(response.codeEnum.Not_Found, null));
    }
}


exports.login = session_login;
exports.getUserSession = session_getUserSession;
exports.cleanUserSession = session_cleanUserSession;
