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
    var rtn = null;
    try {
        if (req.session.user === null) {
            rtn = response.Not_Found;
        } else {
            rtn = response.OK;
            rtn.values = req.session.user;
        }
    } catch (e) {
        rtn = response.Not_Found;
    }
    callback(rtn);
}

var session_getMenuSession = function(req, res, callback) {
    var rtn = null;
    try {
        // console.log("session_getMenuSession>>>>>"+req.session.menu);
        if (req.session.menu === null) {
            rtn = response.Not_Found;
        } else {
            rtn = response.OK;
            rtn.values = req.session.menu;
        }
    } catch (e) {
        rtn = response.Not_Found;
    }
    callback(rtn);
}


var session_cleanUserSession = function(req, res, callback) {
    var rtn = null;
    try {
        req.session.user = null;
        req.session.menu = null;
            rtn = response.OK;
            rtn.values = req.session.user;
    } catch (e) {
        rtn = response.Not_Found;
    }
    callback(rtn);
}


exports.login = session_login;
exports.getUserSession = session_getUserSession;
exports.getMenuSession = session_getMenuSession;
exports.cleanUserSession = session_cleanUserSession;
