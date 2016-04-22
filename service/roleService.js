//--DEFINE---
var Role = require('../bean/roles');
var response = require('../common/response');
var mongoose = require('mongoose');

//--PUBLIC FUNCTION---
var fun_setRole = function(roleobj, callback) {
    roleobj.save(function(err, role) {
        var rtn = response.OK;
        rtn.values = role._id;
        callback(rtn);
    });
}

var fun_getRoleById = function(role_id, callback) {
    ///這段搭配 myTest.js role_id_ary多筆  會有問題  再試試看
    //try async *******
    Role.findById({
        // _id:{$in:role_id}
        _id: role_id
    }, function(err, data) {
        if (err) throw err;
        var resault = null;
        if (null != data) {
            resault = response.OK;
            resault.values = data;
            console.log("in 1")
            return callback(resault);
        } else {
            resault = response.No_Results;
            return callback(resault);
        }
    });
}

var fun_getRoleBySys = function(sys_parameter, callback) {
    // console.log(sys_parameter);
    Role.find({
        system_parameter: sys_parameter
    }, function(err, data) {
        if (err) throw err;
        var rtn = null;
        if (null != data) {
            rtn = response.OK;
            rtn.values = data;
        	callback(rtn);
        } else {
            rtn = response.No_Results;
        	callback(rtn);
        }
    });
}
var fun_getRoleFunByUser = function(obj, callback) {
    var ids = [];
    // console.log("role.obj=="+obj.values);
    if (null != obj) {
        for (var fm in obj.values) {
            // console.log("push ids=="+obj.values[fm].role);
            ids.push(obj.values[fm].role);
        }
        // console.log("ids=="+ids);

        Role.find({
            _id: { $in: ids }
        }, function(err, obj) {
            if (err) {
                throw (err);
            }
            // console.log(obj);
            var rtn = null;
            if (null != obj) {

                var outputArray = [];
                for (var roleIndex in obj) {
                    // console.log(obj[roleIndex]);
                    getUnique(outputArray, obj[roleIndex].menu);
                }
                rtn = response.OK;
                rtn.values = outputArray;
            } else {
                rtn = response.No_Results;
            }
            callback(rtn);
        });
    }
}

//--private function

//取得不重覆參數
function getUnique(outputArray, inputArray) {
    for (var i = 0; i < inputArray.length; i++) {
        if (outputArray.indexOf(inputArray[i]) == -1) {
            outputArray.push(inputArray[i]);
        }
    }
}


//--EXPORT---
exports.setRole = fun_setRole
exports.getRoleById = fun_getRoleById
exports.getRoleBySys = fun_getRoleBySys;
exports.getRoleFunByUser = fun_getRoleFunByUser;
