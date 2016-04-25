//--DEFINE---
var User = require('../bean/users');
var response = require('../common/response');


//--PUBLIC FUNCTION---
var fun_setUserById = function(userobj, callback) {
    User.findByIdAndUpdate(userobj._id, userobj, { new: true }, function(err, data) {
        if (err) throw err;
        rtn = response.OK;
        rtn.values = data;
        callback(rtn);
    });
}

var fun_getUser = function(obj, callback) {
    User.find({
        system_parameter: obj.system_parameter,
        email: obj.email,
        // pwd: obj.pwd
    }, function(err, rtn_obj) {
        if (err) throw err;
        var rtn = null;
        if (null != obj && null != rtn_obj[0] && null != rtn_obj[0].pwd) {
            if (rtn_obj[0].pwd == obj.pwd) {
                rtn = response.OK;
                rtn.values = rtn_obj;
            } else {
                rtn = response.Password_Error;
                rtn.values = rtn_obj;
            }
        } else {
            rtn = response.No_Results;
        }
        callback(rtn);
    });
}

//--PUBLIC FUNCTION---
var fun_registered = function(obj, callback) {
    User.findOne({
        system_parameter: obj.system_parameter,
        email: obj.email
    }, function(err, data) {
        if (err) throw err;
        var rtn = null;

        if (null == data) {
            obj.save(function(err) {
                if (err) throw err;
                rtn = response.OK;
                rtn.values = obj;
                callback(rtn);
            });
        } else {
            rtn = response.Already_Exists;
            callback(rtn);
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
        var rtn = null;
        if (null != data) {
            rtn = response.OK;
            rtn.values = true;
        } else {
            rtn = response.Not_Found;
            rtn.values = false;
        }
        callback(rtn);
    });
}

//將user function_crud儲存
var fun_setMenuCrud = function(userobj, menuAry, callback) {
    User.findById({
        _id: userobj.values[0]._id,
    }, function(err, data) {
        if (err) throw err;
        var rtn = null;
        if (null != data) {
            data.menu_crud = menuAry;
            data.save(function(err) {
                if (err) throw err;
                rtn = response.OK;
                rtn.values = data;
                callback(rtn);
            });
        } else {
            rtn = response.No_Results;
            rtn.values = false;
            callback(rtn);
        }
    });
}

//將user 增加role
var fun_setUserRole = function(userobj, roleIdAry, callback) {
    User.findById({
        _id: userobj.values[0]._id,
    }, function(err, data) {
        if (err) throw err;
        var rtn = null;
        if (null != data) {
            data.role = roleIdAry.values;
            data.save(function(err) {
                if (err) throw err;
                rtn = response.OK;
                rtn.values = data;
                callback(rtn);
            });
        } else {
            rtn = response.No_Results;
            rtn.values = false;
            callback(rtn);
        }
    });
}


var fun_customizeUser = function(userobj, callback) {
    if (null != userobj && null !== userobj.custom) {
        User.findByIdAndUpdate(userobj._id, userobj, { new: true }, function(err, data) {
            var rtn = null;
            if (null != data) {
                rtn = response.OK;
                rtn.values = data;
            } else {
                rtn = response.Not_Found;
            }
            callback(rtn);
        });
    }
}

var fun_getUserRefs = function(userobj, condition, callback) {
    User.findOne({
        system_parameter: userobj.system_parameter,
        email: userobj.email
    }, function(err, user_data) {
        user_data.getRefs(condition, function(data) {
            var rtn = null;
            rtn = response.OK;
            rtn.values = data;

            callback(rtn);
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
