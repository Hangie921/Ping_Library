//--DEFINE---
var LeavePermit = require('../bean/leavePermit');
var LeaveRoleByLevel = require('../bean/leaveRoleByLevel');
var LeaveRoleBySchedule = require('../bean/leaveRoleBySchedule');
var LeaveType = require('../bean/leaveType');
var response = require('../common/response.js');
var mongoose = require('mongoose');

var hashGroup = null;
//--PUBLIC FUNCTION---

//----Leave Permit [[START]]
// var fun_setLeavePermitById = function(obj, callback) {
//     LeavePermit.findByIdAndUpdate(obj._id, obj, { new: true }, function(err, data) {
//         if (err) throw err;
//         rtn = response.OK;
//         rtn.values = data;
//         callback(rtn);
//     });
// }

// var fun_setLeavePermit = function(obj, callback) {
//     obj.save(function(err, saveRtn) {
//         if (err) throw err;
//         var rtn = response.OK;
//         rtn.values = saveRtn;
//         callback(rtn);
//     });
// }

// var fun_getLeavePermitByCondition = function(objCondition, callback) {
//     var condition = {};
//     condition["system_parameter"] = objCondition.system_parameter;

//     if (objCondition.bundle_id) {
//         condition["bundle_id"] = objCondition.bundle_id;
//     }

//     LeavePermit.find({condition},
//         function(err, data) {
//             if (err) throw err;
//             var resault = null;
//             if (null != data) {
//                 resault = response.OK;
//                 resault.values = data;
//                 callback(resault);
//             } else {
//                 resault = response.No_Results;
//                 callback(resault);
//             }
//         });
// }
// exports.setLeavePermitById = fun_setLeavePermitById;
// exports.setLeavePermit = fun_setLeavePermit;
// exports.getLeavePermitByCondition = fun_getLeavePermitByCondition;
//----Leave Permit [[END]]

//----Leave Role By Level [[START]]
// var fun_setLeaveRoleByLevelById = function(obj, callback) {
//     LeaveRoleByLevel.findByIdAndUpdate(obj._id, obj, { new: true }, function(err, data) {
//         if (err) throw err;
//         rtn = response.OK;
//         rtn.values = data;
//         callback(rtn);
//     });
// }

var fun_setLeaveRoleByLevel = function(obj, callback) {
    obj.save(function(err, saveRtn) {
        if (err) throw err;
        var rtn = response.OK;
        rtn.values = saveRtn;
        callback(rtn);
    });
}

var fun_getLeaveRoleByLevelByCondition = function(objCondition, callback) {
        var condition = {};
        if (objCondition.system_parameter) {
            condition["system_parameter"] = objCondition.system_parameter;
        } else {
            condition.system_parameter = { $exists: false };
        }

        if (objCondition._id) {
            condition["_id"] = objCondition._id;
        }
        if (objCondition.level) {
            condition["level"] = objCondition.level;
        }

        LeaveRoleByLevel.find(
            condition,
            function(err, lrbl_data) {
                var rtn = null;
                rtn = response.OK;
                rtn.values = lrbl_data;
                callback(rtn);
            });


    }
    // exports.setLeaveRoleByLevelById = fun_setLeaveRoleByLevelById;
exports.setLeaveRoleByLevel = fun_setLeaveRoleByLevel;
exports.getLeaveRoleByLevelByCondition = fun_getLeaveRoleByLevelByCondition;

//----Leave Role By Level [[END]]


//----Leave Role By Schedule [[START]]
// var fun_setLeaveRoleByScheduleById = function(obj, callback) {
//     LeaveRoleBySchedule.findByIdAndUpdate(obj._id, obj, { new: true }, function(err, data) {
//         if (err) throw err;
//         rtn = response.OK;
//         rtn.values = data;
//         callback(rtn);
//     });
// }

// var fun_setLeaveRoleBySchedule = function(obj, callback) {
//     obj.save(function(err, saveRtn) {
//         if (err) throw err;
//         var rtn = response.OK;
//         rtn.values = saveRtn;
//         callback(rtn);
//     });
// }

// var fun_getLeaveRoleByScheduleByCondition = function(objCondition, callback) {
//     var condition = {};
//     condition["system_parameter"] = objCondition.system_parameter;

//     if (objCondition.days) {
//         //gtgtgtgtgtgt  first1
//         condition["days"] = objCondition.days;
//     }

//     LeavePermit.find({condition},
//         function(err, data) {
//             if (err) throw err;
//             var resault = null;
//             if (null != data) {
//                 resault = response.OK;
//                 resault.values = data;
//                 callback(resault);
//             } else {
//                 resault = response.No_Results;
//                 callback(resault);
//             }
//         });
// }
// exports.setLeaveRoleByScheduleById = fun_setLeaveRoleByScheduleById;
// exports.setLeaveRoleBySchedule = fun_setLeaveRoleBySchedule;
// exports.getLeaveRoleByScheduleByCondition = fun_getLeaveRoleByScheduleByCondition;
//----Leave Role By Schedule [[END]]
