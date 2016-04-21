//--DEFINE---
var User = require('../bean/users');
var response = require('../common/response');


//--PUBLIC FUNCTION---
var fun_setUserById = function(userobj, callback) {
    User.findByIdAndUpdate(userobj._id,userobj,{new: true},function (err,data) {
    	if (err) throw err;
    	callback(response.obj(response.codeEnum.OK, data));
    });
}

var fun_getUser = function(obj, callback) {
    User.find({
        system_parameter: obj.system_parameter,
        email: obj.email,
        // pwd: obj.pwd
    }, function(err, rtn_obj) {
        if (err) throw err;
        if (null != obj && null != rtn_obj[0] && null != rtn_obj[0].pwd) {
            if (rtn_obj[0].pwd == obj.pwd) {
                callback(response.obj(response.codeEnum.OK, rtn_obj));
            } else {
                callback(response.obj(response.codeEnum.Password_Error, rtn_obj));
            }
        } else {
            callback(response.obj(response.codeEnum.Bad_Request, 'not found'));
        }
    });
}

//--PUBLIC FUNCTION---
var fun_registered = function(obj, callback) {
    User.findOne({
        system_parameter: obj.system_parameter,
        email: obj.email
    }, function(err, data) {
        if (err) throw err;

        if (null == data) {
            obj.save(function(err) {
                if (err) throw err;
                callback(response.obj(response.codeEnum.OK, obj));
            });
        } else {
            callback(response.obj(response.codeEnum.Already_Exists, "Already Exists"));
        }
    });
}

//--PUBLIC FUNCTION---
var fun_emailCheck = function(obj, callback) {
    User.findOne({
        system_parameter: obj.system_parameter,
        email: obj.email
    }, function(err, data) {
        if (err) throw err;
        if (null != data) {
            callback(response.obj(response.codeEnum.OK, true));
        } else {
            callback(response.obj(response.codeEnum.Not_Found, false));
        }
    });
}

//將user function_crud儲存
var fun_setMenuCrud = function(userobj, menuAry, callback) {
    User.findById({
        _id: userobj.values[0]._id,
    }, function(err, data) {
        if (err) throw err;
        if (null != data) {
            data.menu_crud = menuAry;
            data.save(function(err) {
                if (err) throw err;
                callback(response.obj(response.codeEnum.OK, data));
            });
        } else {
            callback(response.obj(response.codeEnum.No_Results, false));
        }
    });
}

//將user 增加role
var fun_setUserRole = function(userobj, roleIdAry, callback) {
    User.findById({
        _id: userobj.values[0]._id,
    }, function(err, data) {
        if (err) throw err;
        if (null != data) {
            data.role = roleIdAry.values;
            data.save(function(err) {
                if (err) throw err;
                callback(response.obj(response.codeEnum.OK, data));
            });
        } else {
            callback(response.obj(response.codeEnum.No_Results, false));
        }
    });
}


var fun_customizeUser = function(userobj, callback) {
    if (null != userobj && null !== userobj.custom) {
        User.findByIdAndUpdate(userobj._id, userobj, { new: true }, function(err, data) {
            if (null != data) {
                callback(response.obj(response.codeEnum.OK, data));
            } else {
                callback(response.obj(response.codeEnum.Not_Found, null));
            }
        });
    }
}

var fun_getUserRefs = function(userobj, condition, callback) {
    User.findOne({
        system_parameter: userobj.system_parameter,
        email: userobj.email
    }, function(err, user_data) {
        user_data.getRefs(condition, function(argument) {
            callback(response.obj(response.codeEnum.OK, user_data_callback));
        });
    });
}

//--EXPORT---
exports.setUserById = fun_setUserById;
exports.getUser = fun_getUser;
exports.registered = fun_registered;
exports.emailCheck = fun_emailCheck;
exports.setMenuCrud = fun_setMenuCrud;
exports.setUserRole = fun_setUserRole;
exports.customizeUser = fun_customizeUser;
exports.getUserRefs = fun_getUserRefs;
