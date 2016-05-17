//--DEFINE---
var LeavePermit = require('../bean/leavePermit');
var LeaveRoleByLevel = require('../bean/leaveRoleByLevel');
var LeaveRoleBySchedule = require('../bean/leaveRoleBySchedule');
var LeaveType = require('../bean/leaveType');
var response = require('../common/response.js');
var mongoose = require('mongoose');
var clone = require('../common/clone');
var GroupService = require('./groupService');
var uuid = require('node-uuid');

var hashGroup = null;
//--PUBLIC FUNCTION---
//----Leave Permit [[START]]
//新增假單
var fun_viewLeaveProcess = function(userobj, leaveYear, callback) {
    console.log("userobj is "+userobj);
    //以USER的GROUP_id 找出  屬於自己組織這層 未簽的
    var resault = null;
    GroupService.getGroupList(userobj.system_parameter, function(group_data) {
        console.log("group_data is "+group_data);
        var clone_group_data = clone(group_data);
        var searchPermitGroupIdCondition = new LeavePermit();
        searchPermitGroupIdCondition.system_parameter = userobj.system_parameter;
        searchPermitGroupIdCondition.leave_year = leaveYear;
        var mygroup = getGroupById(clone_group_data, userobj.group_id);
        console.log("userobj.group_id="+userobj.group_id);
        console.log("mygroup=" + mygroup);
        if (mygroup) {
            console.log("process in...");
            // searchPermitGroupIdCondition.permit_rank = mygroup.rank; //?
            fun_getLeavePermitByCondition(searchPermitGroupIdCondition, function(myTeamLeaveProcess) {
                console.log("myTeamLeaveProcess=" + myTeamLeaveProcess.values);

                resault = response.OK;
                resault.values = {myTeamLeaveProcess:myTeamLeaveProcess.values};
                callback(resault);
            });
        } else {
            resault = response.No_Results;
            resault.values = "";
            callback(resault);
        }
    });
}

//userobj
var fun_createLeaveProcess = function(userobj, leaveobj, callback) {
        //user 所屬 group 結構
        GroupService.getGroupList(leaveobj.system_parameter, function(group_data) {
                console.log("group_data1:" + group_data);
            //user取得年資
            var level_month = Math.floor((new Date - Date.parse(userobj.available_date)) / (24 * 60 * 60 * 1000 * 12));

            //4.user 請假天數 找出需幾層簽名
            var scheduleCondition = LeaveRoleBySchedule;
            scheduleCondition.system_parameter = leaveobj.system_parameter;
            scheduleCondition.days = leaveobj.days;
            fun_getLeaveRoleByScheduleByCondition(scheduleCondition, function(schedule_data) {
                var need_rank = schedule_data.values[0].need_rank_apply;
                console.log("need_rank:" + need_rank);
                console.log("group_data2:" + group_data);
                //need_rank = 3  group_data=2(0,1,2);
                //if need_rank > group_data  => needrank = group_data  ;
                //假設 需要的層級  多於 自己組織結構的層次  則以組織結構最大為need_rank
                if (need_rank > group_data) {
                    need_rank = group_data;
                }

                //將group 一直線向上搜尋
                var groupLine = new Array();
                var groupLineObj = new Array();
                var tempGroupId = userobj.group_id;
                var tempGroup = getGroupById(group_data, tempGroupId);
                tempGroupId = tempGroup.parent_id;
                for (var i = 0; i < need_rank; i++) {
                    //取得需要核准簽程的層
                    console.log("tempGroupId="+tempGroupId);
                    tempGroup = getGroupById(group_data, tempGroupId);
                    console.log("tempGroup is "+tempGroup);
                    tempGroupId = tempGroup.parent_id;
                    groupLine.push(tempGroupId);
                    groupLineObj.push(tempGroup);

                }
                console.log("groupLine=" + groupLine);
                console.log("groupLineObj=" + groupLineObj);
                var bundle_id = uuid.v1();
                if (groupLineObj) {
                    for (var i in groupLineObj) {
                        //create 假單
                        createLeavePermit = new LeavePermit();
                        createLeavePermit.system_parameter = groupLineObj[i].system_parameter;
                        createLeavePermit._id = uuid.v1();
                        createLeavePermit.bundle_id = bundle_id;
                        createLeavePermit.leave_year = leaveobj.leave_year;
                        createLeavePermit.leave_user_id = userobj._id; //請假人=登入的人
                        createLeavePermit.leave_type = leaveobj.leave_type;
                        createLeavePermit.permit_rank = groupLineObj[i].rank;
                        createLeavePermit.leave_total_hour = leaveobj.days;
                        // createLeavePermit.permit_apply_day = "2016/01/01";//test用假設都簽核了

                        fun_setLeavePermit(createLeavePermit, function(input_data) {
                            console.log("input_data =" + input_data.values);
                        });
                    }

                    var resault = null;
                    resault = response.OK;
                    resault.values = null;
                    callback(resault);
                }
            });


        });


    }
    //
var fun_getUserLeaveProcess = function(userobj, leaveYear, callback) {
    //1.取得-user資料(api 傳入)
    //2.算出-user年資
    var level_month = Math.floor((new Date - Date.parse(userobj.available_date)) / (24 * 60 * 60 * 1000 * 12));
    console.log('USER 資歷 多少 單位(month)=' + level_month);
    //3.取得年資表leaveRoleBySchedule  days(請假起訖),system_parameter
    var scheduleCondition = LeaveRoleBySchedule;
    scheduleCondition.system_parameter = userobj.system_parameter;

    //由於算式較為複雜 暫時以leave_total_hour 代替 直接寫入小時
    // var permit_day = Math.floor((Date.parse("2015/1/1 18:00") - Date.parse("2015/1/1 08:00")) / (24 * 60 * 60 * 1000 * 12));
    // console.log("permit_day="+permit_day);
    // scheduleCondition.days = leaveobj.leave_total_hour * 60;
    // console.log("scheduleCondition.days=" + scheduleCondition.days);
    fun_getLeaveRoleByScheduleByCondition(scheduleCondition, function(schedule_data) {
        console.log("找出了申請的層級:" + schedule_data.values);

        //4.找出符合user的年資表
        var levelCondition = new LeaveRoleByLevel;
        levelCondition.system_parameter = userobj.system_parameter;
        levelCondition.level = level_month;
        console.log("level_month=" + level_month); //USER年資 以月份計算

        //user依照年資找出自己的假別 可請假時數
        var rtnLeaveRoleByLevel = new Array();

        fun_getLeaveRoleByLevelByCondition(levelCondition, function(level_data) {
            clone_level_data = clone(level_data.values);
            console.log("找出符合user的年資表" + clone_level_data); //各類別最後只要取第一筆
            var tempLevelType = "";
            //剔除多餘的資料  僅抓取每個leave_type一種有效資料
            if (clone_level_data) {
                for (var i in clone_level_data) {
                    if (tempLevelType != clone_level_data[i].leave_type_id) {
                        tempLevelType = clone_level_data[i].leave_type_id;
                        rtnLeaveRoleByLevel.push(clone_level_data[i]);
                    }
                }
            }
            console.log("各類假單總共時數  :=" + rtnLeaveRoleByLevel);

            //轉換皆為leavePermit 但查詢條件不放入全部條件
            var leavePermitCondition = new LeavePermit();
            leavePermitCondition.system_parameter = userobj.system_parameter;
            leavePermitCondition.leave_year = leaveYear;
            leavePermitCondition.leave_user_id = userobj.leave_user_id;

            //查詢出該USER 當年度 所有假單 以bundle
            fun_getLeavePermitDistinct(leavePermitCondition, function(bundleList) {
                var leavePermitProcessing = new Array(); //處理中的假單 列表
                var leavePermitFinish = new Array(); //已經完成的假單 列表
                //USER 所傭有的假單(此時還未知那些單已經結束)
                clone_bundleList = (clone(bundleList.values) + "").split(",");
                //先把當年度所有假單取出
                fun_getLeavePermitByCondition(leavePermitCondition, function(permitDataAllYear) {
                    // console.log("USER Permit list:" + permitDataAllYear.values);
                    clone_permitDataAllYear = clone(permitDataAllYear.values);
                    // console.log(clone_bundleList);
                    for (var k in clone_bundleList) {
                        var allowed = true;
                        for (var m in clone_permitDataAllYear) {
                            if (clone_bundleList[k] == clone_permitDataAllYear[m].bundle_id) {
                                if (!clone_permitDataAllYear[m].permit_apply_day) {
                                    //有單未簽
                                    allowed = false;
                                    leavePermitProcessing.push(clone_permitDataAllYear[m]);
                                    break; //break to clone_bundleList loop
                                }
                            }
                        }
                        if (allowed) { //已經完成的單
                            // leavePermitFinish.push
                            for (var m in clone_permitDataAllYear) {
                                if (clone_bundleList[k] == clone_permitDataAllYear[m].bundle_id) {
                                    //已經簽完畢 只需要第一筆資訊
                                    leavePermitFinish.push(clone_permitDataAllYear[m]);

                                    //消耗請假時數
                                    for (var e in rtnLeaveRoleByLevel) {
                                        if (rtnLeaveRoleByLevel[e].leave_type_id ==
                                            clone_permitDataAllYear[m].leave_type) {
                                            rtnLeaveRoleByLevel[e].use_days =
                                                rtnLeaveRoleByLevel[e].use_days - (clone_permitDataAllYear[m].leave_total_hour);
                                        }
                                    }

                                    break;
                                }
                            }
                        }
                    }
                    console.log("未簽核的單目前位置:" + leavePermitProcessing);
                    console.log("已簽核的單目前位置:" + leavePermitFinish);
                    console.log("各類假單剩餘時數  :" + rtnLeaveRoleByLevel);

                    var rtnData = {};
                    rtnData.leavePermitProcessing = leavePermitProcessing;
                    rtnData.leavePermitFinish = leavePermitFinish;
                    rtnData.rtnLeaveRoleByLevel = rtnLeaveRoleByLevel;

                    var resault = null;
                    resault = response.OK;
                    resault.values = rtnData;
                    callback(resault);
                });
            });

        });
    });
}

var fun_setLeavePermit = function(obj, callback) {
    obj.save(function(err, saveRtn) {
        if (err) throw err;
        var rtn = response.OK;
        rtn.values = saveRtn;
        callback(rtn);
    });
}

var fun_setLeavePermitById = function(leavePermitObj, callback) {
    LeavePermit.findByIdAndUpdate(leavePermitObj._id, leavePermitObj, { new: true }, function(err, data) {
        if (err) throw err;
        var rtn = response.OK;
        rtn.values = data;
        callback(rtn);
    });
}

var fun_getLeavePermitByCondition = function(objCondition, callback) {
    var condition = {};
    if (objCondition.system_parameter) {
        condition["system_parameter"] = objCondition.system_parameter;
    } else {
        condition.system_parameter = { $exists: false };
    }
    if (objCondition.bundle_id) {
        condition["bundle_id"] = objCondition.bundle_id;
    }
    if (objCondition.leave_year) {
        condition["leave_year"] = objCondition.leave_year;
    }
    if (objCondition.leave_user_id) {
        condition["leave_user_id"] = objCondition.leave_user_id;
    }
    if (objCondition.permit_rank) {
        condition["permit_rank"] = objCondition.permit_rank;
    }

    LeavePermit.find(condition,
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
        }).sort({ bundle_id: -1, permit_rank: -1 });
}

var fun_getLeavePermitDistinct = function(objCondition, callback) {
    var condition = {};
    if (objCondition.system_parameter) {
        condition["system_parameter"] = objCondition.system_parameter;
    } else {
        condition.system_parameter = { $exists: false };
    }

    if (objCondition.bundle_id) {
        condition["bundle_id"] = objCondition.bundle_id;
    }
    if (objCondition.leave_year) {
        condition["leave_year"] = objCondition.leave_year;
    }
    if (objCondition.leave_user_id) {
        condition["leave_user_id"] = objCondition.leave_user_id;
    }

    LeavePermit.distinct("bundle_id", condition,
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
        }).distinct("leave_type");
}
exports.viewLeaveProcess = fun_viewLeaveProcess;
exports.createLeaveProcess = fun_createLeaveProcess;
exports.getUserLeaveProcess = fun_getUserLeaveProcess;
exports.setLeavePermit = fun_setLeavePermit;
exports.setLeavePermitById = fun_setLeavePermitById
exports.getLeavePermitByCondition = fun_getLeavePermitByCondition;
//----Leave Permit [[END]]

//----Leave Role By Level [[START]]
var fun_setLeaveRoleByLevelById = function(obj, callback) {
    LeaveRoleByLevel.findByIdAndUpdate(obj._id, obj, { new: true }, function(err, data) {
        if (err) throw err;
        rtn = response.OK;
        rtn.values = data;
        callback(rtn);
    });
}

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
        condition["level"] = { $lt: objCondition.level };;
    }

    LeaveRoleByLevel.find(
        condition,
        function(err, lrbl_data) {
            var rtn = null;
            rtn = response.OK;
            rtn.values = lrbl_data;
            callback(rtn);
        }).sort({ leave_type_id: -1, level: -1 });


}
exports.setLeaveRoleByLevelById = fun_setLeaveRoleByLevelById;
exports.setLeaveRoleByLevel = fun_setLeaveRoleByLevel;
exports.getLeaveRoleByLevelByCondition = fun_getLeaveRoleByLevelByCondition;

//----Leave Role By Level [[END]]


//----Leave Role By Schedule [[START]]
var fun_setLeaveRoleByScheduleById = function(obj, callback) {
    LeaveRoleBySchedule.findByIdAndUpdate(obj._id, obj, { new: true }, function(err, data) {
        if (err) throw err;
        rtn = response.OK;
        rtn.values = data;
        callback(rtn);
    });
}

var fun_setLeaveRoleBySchedule = function(obj, callback) {
    obj.save(function(err, saveRtn) {
        if (err) throw err;
        var rtn = response.OK;
        rtn.values = saveRtn;
        callback(rtn);
    });
}

var fun_getLeaveRoleByScheduleByCondition = function(objCondition, callback) {
    var condition = {};
    if (objCondition.system_parameter) {
        condition["system_parameter"] = objCondition.system_parameter;
    } else {
        condition.system_parameter = { $exists: false };
    }

    if (objCondition.days) {
        condition["days"] = { $lt: objCondition.days };
    }


    LeaveRoleBySchedule.find(
        condition,
        function(err, lrbs_data) {
            var rtn = null;
            rtn = response.OK;
            rtn.values = lrbs_data;
            callback(rtn);
        }).sort({ days: -1 });
}
exports.setLeaveRoleByScheduleById = fun_setLeaveRoleByScheduleById;
exports.setLeaveRoleBySchedule = fun_setLeaveRoleBySchedule;
exports.getLeaveRoleByScheduleByCondition = fun_getLeaveRoleByScheduleByCondition;
//----Leave Role By Schedule [[END]]


//---private
function getGroupById(group_data, _id) {
    for (var i = 0; i < group_data.length; i++) {
        if (group_data[i]._id == _id) {
            return group_data[i];
        }
    }

}
