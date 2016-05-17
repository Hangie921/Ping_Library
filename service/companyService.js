//--DEFINE---
var Company = require('../bean/company');
var LeaveRoleByLevel = require('../bean/leaveRoleByLevel');
var LeaveService = require('./leaveService');
var LeaveRoleByLevel = require('../bean/leaveRoleByLevel');
var LeaveRoleBySchedule = require('../bean/leaveRoleBySchedule');
// var LeaveType = require('../bean/leaveType');
var response = require('../common/response');
var mongoose = require('mongoose');
var clone = require('../common/clone');
var uuid = require('node-uuid');

//--PUBLIC FUNCTION---
var fun_setCompanyById = function(companyobj, callback) {
    Company.findByIdAndUpdate(companyobj._id, companyobj, { new: true }, function(err, data) {
        if (err) throw err;
        rtn = response.OK;
        rtn.values = data;
        callback(rtn);
    });
}

var fun_setCompany = function(companyobj, callback) {
    companyobj.save(function(err, company) {
        if (err) throw err;
        var rtn = response.OK;
        rtn.values = company._id;

        //新增公司專用請假選項 及 規則
        setLeaveDefVal(company.system_parameter);

        callback(rtn);
    });
}

var fun_getCompany = function(company_id, callback) {
    var condition = {};
    if (company_id) {
        condition["system_parameter"] = company_id;
    }
    Company.find(
        condition,
        function(err, data) {
            if (err) throw err;
            var resault = null;
            if (null != data) {
                resault = response.OK;
                resault.values = data;
                callback(resault);
            } else {
                resault = response.No_Results;
                callback(resault);
            }
        });
}

var fun_getCompanyById = function(company_id, callback) {
    Company.findById({
        _id: company_id
    }, function(err, data) {
        if (err) throw err;
        var resault = null;
        if (null != data) {
            resault = response.OK;
            resault.values = data;
            callback(resault);
        } else {
            resault = response.No_Results;
            callback(resault);
        }
    });
}


//private
// var fun_setLeaveDefVal = function(new_system_parameter, callback) {
function setLeaveDefVal(new_system_parameter) {
    console.log("fun_setLeaveDefVal in...");
    var queryLeaveRoleByLevelByCondition = new LeaveRoleByLevel();
    //查詢出所有system_parameter=undefined
    LeaveService.getLeaveRoleByLevelByCondition(queryLeaveRoleByLevelByCondition, function(default_leave_role) {
        for (var i in default_leave_role.values) {
            var newData = new LeaveRoleByLevel();

            newData._id = uuid.v1();
            newData.system_parameter = new_system_parameter;
            newData.leave_type_id = default_leave_role.values[i].leave_type_id;
            newData.level = default_leave_role.values[i].level;
            newData.use_days = default_leave_role.values[i].use_days;
            LeaveService.setLeaveRoleByLevel(newData, function(data_rtn) {});
        }
    });


    var queryLeaveRoleByScheduleByCondition = new LeaveRoleBySchedule();
    LeaveService.getLeaveRoleByScheduleByCondition(queryLeaveRoleByScheduleByCondition, function(default_schedule_role) {
        for (var i in default_schedule_role.values) {
            var newData = new LeaveRoleBySchedule();

            newData._id = uuid.v1();
            newData.system_parameter = new_system_parameter;
            newData.days = default_schedule_role.values[i].days;
            newData.need_rank_apply = default_schedule_role.values[i].need_rank_apply;
            newData.need_group_id_apply = default_schedule_role.values[i].need_group_id_apply;
            LeaveService.setLeaveRoleBySchedule(newData, function(data_rtn) {});
        }
    });

}

//--EXPORT---
exports.setCompanyById = fun_setCompanyById;
exports.setCompany = fun_setCompany;
exports.getCompanyById = fun_getCompanyById;
exports.getCompany = fun_getCompany;

// exports.setLeaveDefVal = fun_setLeaveDefVal;
