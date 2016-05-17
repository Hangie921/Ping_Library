var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

// mongodb = 'mongodb://localhost/test';
mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var Company = pinglib.Company;
var Group = pinglib.Group;
var LeavePermit = pinglib.LeavePermit;
var LeaveType = pinglib.LeaveType;
var LeaveRoleByLevel = pinglib.LeaveRoleByLevel;
var LeaveRoleBySchedule = pinglib.LeaveRoleBySchedule;
var GroupService = pinglib.GroupService;
var CompanyService = pinglib.CompanyService;
var LeaveService = pinglib.LeaveService;

function output(msg) {
    if (true)
        console.log(msg);
}

describe('LeaveService', function() {
    function newUser() {
        var user = new User();
        user.system_parameter = 21;
        user.id_number = "no21"
        user.email = '21@ping.com.sg';
        user.name = '21號測試人員';
        user.pwd = '!QAZ@WSX';
        user.company_id = "ping_team";
        user.group_id = "";
        return user;
    }

    function newCompany() {
        var company = new Company();
        company._id = "ping_team";
        company.system_parameter = 21;
        company.id_number = "55667788"
        company.name = 'Ping製作團隊';
        company.address = '新北市鬧區';
        company.url = 'http://ping.com.tw';
        return company;
    }
    //產生group 
    function newGroup2() {
        var group = new Group();
        group._id = "test_mis1";
        group.system_parameter = 21;
        group.rank = 0;
        group.parent_id = null;
        group.name = "MIS 部";
        return group;
    }

    function newGroup2_1() {
        var group = new Group();
        group._id = "test_mis1_1";
        group.system_parameter = 21;
        group.rank = 1;
        group.parent_id = 'test_mis1';
        group.name = "軟體工程組";
        return group;
    }

    function newGroup2_2() {
        var group = new Group();
        group._id = "test_mis1_2";
        group.system_parameter = 21;
        group.rank = 1;
        group.parent_id = 'test_mis1';
        group.name = "硬體工程組";
        return group;
    }

    function newGroup2_2_1() {
        var group = new Group();
        group._id = "test_mis1_2_1";
        group.system_parameter = 21;
        group.rank = 2;
        group.parent_id = 'test_mis1_2';
        group.name = "硬體工程第一小分隊";
        return group;
    }

    function newGroup2_2_2() {
        var group = new Group();
        group._id = "test_mis1_2_2";
        group.system_parameter = 21;
        group.rank = 2;
        group.parent_id = 'test_mis1_2';
        group.name = "硬體工程第二小分隊";
        return group;
    }

    var leaveType = [
        { _id: "leaveType001", name: "病假" },
        { _id: "leaveType002", name: "公假" },
        { _id: "leaveType003", name: "特休" },
        { _id: "leaveType004", name: "補休", descript: "51勞工節" },
        { _id: "leaveType005", name: "其他", descript: "" },
    ]

    var leaveRoleByLevel = [
        { system_parameter: 21, _id: "leaveRoleByLevel001", leave_type_id: "leaveType003", level: 36, use_days: 3360 }, //36個月(3年)3360小時(8(一天八小時)x60 x7(天))
        { system_parameter: 21, _id: "leaveRoleByLevel002", leave_type_id: "leaveType003", level: 60, use_days: 4800 }, //60個月(5年)3360小時(8(一天八小時)x60 x10(天))
        { system_parameter: 21, _id: "leaveRoleByLevel003", leave_type_id: "leaveType003", level: 120, use_days: 5280 }, //120個月(10年)3360小時(8(一天八小時)x60 x11(天))
        { system_parameter: 21, _id: "leaveRoleByLevel004", leave_type_id: "leaveType003", level: 132, use_days: 5760 }, //132個月(11年)3360小時(8(一天八小時)x60 x12(天))
        { system_parameter: 21, _id: "leaveRoleByLevel005", leave_type_id: "leaveType003", level: 144, use_days: 6240 }, //144個月(12年)3360小時(8(一天八小時)x60 x13(天))
        { system_parameter: 21, _id: "leaveRoleByLevel006", leave_type_id: "leaveType004", level: 0, use_days: 480 },
    ]

    var leaveRoleBySchedule = [
        { system_parameter: 21, _id: "leaveRoleBySchedule001", days: 1, need_rank_apply: 1 },
        { system_parameter: 21, _id: "leaveRoleBySchedule002", days: 960, need_rank_apply: 2 }, //超過16小時(2天=960分鐘) 必須2層主管簽名
        { system_parameter: 21, _id: "leaveRoleBySchedule003", days: 2880, need_rank_apply: 3 }, //超過2880小時(6天=2889分鐘) 必須3層主管簽名
    ]

    var userPermitList = [
        { system_parameter: 21, _id: "user_permit_list001", leave_year: "2016", leave_user_id: "no21", leave_type: "leaveType003", permit_user_id: null, permit_rank: 2, permit_id: "", permit_apply_day: "", bundle_id: "bundle01" },
        { system_parameter: 21, _id: "user_permit_list002", leave_year: "2016", leave_user_id: "no21", leave_type: "leaveType003", permit_user_id: null, permit_rank: 1, permit_id: "", permit_apply_day: "", bundle_id: "bundle01" },
        { system_parameter: 21, _id: "user_permit_list003", leave_year: "2016", leave_user_id: "no21", leave_type: "leaveType003", permit_user_id: null, permit_rank: 3, permit_id: "", permit_apply_day: "2016/05/03", bundle_id: "bundle02", leave_total_hour: 480 },
        { system_parameter: 21, _id: "user_permit_list005", leave_year: "2016", leave_user_id: "no21", leave_type: "leaveType003", permit_user_id: null, permit_rank: 1, permit_id: "", permit_apply_day: "2016/05/03", bundle_id: "bundle02", leave_total_hour: 480 },
        { system_parameter: 21, _id: "user_permit_list004", leave_year: "2016", leave_user_id: "no21", leave_type: "leaveType003", permit_user_id: null, permit_rank: 2, permit_id: "", permit_apply_day: "2016/05/03", bundle_id: "bundle02", leave_total_hour: 480 },
        { system_parameter: 21, _id: "user_permit_list008", leave_year: "2016", leave_user_id: "no88", leave_type: "leaveType004", permit_user_id: null, permit_rank: 1, permit_id: "", permit_apply_day: "", bundle_id: "bundle05" },
        { system_parameter: 21, _id: "user_permit_list006", leave_year: "2016", leave_user_id: "no21", leave_type: "leaveType004", permit_user_id: null, permit_rank: 1, permit_id: "", permit_apply_day: "", bundle_id: "bundle03" },
        { system_parameter: 21, _id: "user_permit_list007", leave_year: "2016", leave_user_id: "no88", leave_type: "leaveType003", permit_user_id: null, permit_rank: 1, permit_id: "", permit_apply_day: "", bundle_id: "bundle04" },
    ]

    beforeEach(function(done) {
        function clearDB() {
            for (var i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function() {});
            }
            GroupService.setGroup(newGroup2(), function(data4) {
                GroupService.setGroup(newGroup2_1(), function(data5) {
                    GroupService.setGroup(newGroup2_2(), function(data6) {
                        GroupService.setGroup(newGroup2_2_1(), function(data6) {
                            GroupService.setGroup(newGroup2_2_2(), function(data6) {

                                LeaveType.collection.insertMany(leaveType, function(err, r) {

                                    LeaveRoleByLevel.collection.insertMany(leaveRoleByLevel, function(err, r) {

                                        LeaveRoleBySchedule.collection.insertMany(leaveRoleBySchedule, function(err, r) {

                                            LeavePermit.collection.insertMany(userPermitList, function(err, r) {

                                                return done();
                                            });
                                            // output("cleanDB()");
                                        });
                                    });
                                });
                            });

                        });
                    });
                });
            });
        }


        if (mongoose.connection.readyState === 0) {
            mongoose.connect(mongodb, function(err) {
                if (err) throw err;
                return clearDB();
            });
        } else {
            return clearDB();
        }
    });


    after(function() {
        // afterEach(function(done) {
        mongoose.disconnect();
        // return done();
    });

    describe('#fun_getUserLeaveProcess(userobj,leaveobj, callback)', function() {
        it('test ', function(done) {
            async.series({
                createLeaveProcess: function(callback) {
                    var userobj = pinglib.User;
                    userobj.available_date = '2010/5/10'; //員工到職日
                    userobj.company_id = 'ping_team'; //所屬公司
                    userobj._id = 'no21';
                    userobj.system_parameter = 21;
                    userobj.group_id = 'test_mis1_2_2';

                    var leaveobj = pinglib.LeavePermit;
                    leaveobj.system_parameter = 21;
                    leaveobj.days = 3*(8*60);
                    leaveobj.leave_year = "2016";
                    leaveobj.leave_type = "leaveType003";

                    LeaveService.createLeaveProcess(userobj,leaveobj, function(argument) {
                        callback();
                    });
                },
                getUserLeaveProcess: function(callback) {
                    var userobj = pinglib.User;
                    userobj.available_date = '2010/5/10'; //員工到職日
                    userobj.company_id = 'ping_team'; //所屬公司
                    userobj._id='no21';
                    userobj.system_parameter = 21;

                    LeaveService.getUserLeaveProcess(userobj, '2016', function(data) {
                        callback();
                    });
                },
                myTeamLeaveProcess:function (callback) {
                    var userobj2 = pinglib.User;
                    userobj2.company_id = 'ping_team'; //所屬公司
                    userobj2._id='no22';
                    userobj2.system_parameter = 21;
                    userobj2.group_id = "test_mis1_2";

                    var serachYear = "2016";
                    LeaveService.viewLeaveProcess(userobj2,serachYear,function (data) {
                        callback();
                    });
                }
            }, function(err, results) {
                done();
            });

        });
    });

});
