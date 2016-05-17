var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

// mongodb = 'mongodb://localhost/test';
mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var Company = pinglib.Company;
var LeaveRoleByLevel = pinglib.LeaveRoleByLevel;
var LeaveRoleBySchedule = pinglib.LeaveRoleBySchedule;
var CompanyService = pinglib.CompanyService;
var LeaveService = pinglib.LeaveService;

function output(msg) {
    if (true)
        console.log(msg);
}
describe('CompanyService', function() {
    function newCompany() {
        var company = new Company();
        company._id = "ping_team";
        company.system_parameter = 0;
        company.id_number = "55667788"
        company.name = 'Ping製作團隊';
        company.address = '新北市鬧區';
        company.url = 'http://ping.com.tw';
        return company;
    }

    var leaveRoleByLevel = [
        { _id: "leaveRoleByLevel001", leave_type_id: "leaveType003", level: 36, use_days: 3360 }, //36個月(3年)3360小時(8(一天八小時)x60 x7(天))
        { _id: "leaveRoleByLevel002", leave_type_id: "leaveType003", level: 60, use_days: 4800 }, //60個月(5年)3360小時(8(一天八小時)x60 x10(天))
        { _id: "leaveRoleByLevel003", leave_type_id: "leaveType003", level: 120, use_days: 5280 }, //120個月(10年)3360小時(8(一天八小時)x60 x11(天))
        { _id: "leaveRoleByLevel004", leave_type_id: "leaveType003", level: 132, use_days: 5760 }, //132個月(11年)3360小時(8(一天八小時)x60 x12(天))
        { _id: "leaveRoleByLevel005", leave_type_id: "leaveType003", level: 144, use_days: 6240 }, //144個月(12年)3360小時(8(一天八小時)x60 x13(天))
        { _id: "leaveRoleByLevel006", leave_type_id: "leaveType004", level: 0, use_days: 480 },
    ]
    var leaveRoleBySchedule = [
        { _id: "leaveRoleBySchedule001", days: 1, need_rank_apply: 1 },
        { _id: "leaveRoleBySchedule002", days: 960, need_rank_apply: 2 }, //超過16小時(2天=960分鐘) 必須2層主管簽名
        { _id: "leaveRoleBySchedule003", days: 2880, need_rank_apply: 3 }, //超過2880小時(6天=2889分鐘) 必須3層主管簽名
    ]

    beforeEach(function(done) {
        function clearDB() {
            for (var i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function() {});
            }
            LeaveRoleByLevel.collection.insertMany(leaveRoleByLevel, function(err, r) {});
            LeaveRoleBySchedule.collection.insertMany(leaveRoleBySchedule, function(err, r) {});
            // output("cleanDB()");
            return done();
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

    describe('#getCompanyById(companyobj, function(data)) ', function() {
        it('getCompanyById ', function(done) {
            var companyData = newCompany();
            async.series({
                setCompany: function(callback) {
                    CompanyService.setCompany(companyData, function(company_data) {
                        (company_data.values).should.be.equal(companyData._id);
                        CompanyService.getCompanyById(company_data.values, function(company_val) {
                            (company_val.values).should.be.a('object');
                            callback();
                        });
                    });
                },
                getLeave: function(callback) {

                    // var queryLeaveRoleByLevel = new LeaveRoleByLevel();
                    // console.log("search condition...queryLeaveRoleByLevel=" + queryLeaveRoleByLevel);
                    // CompanyService.setLeaveDefVal(queryLeaveRoleByLevel,function (data) {
                    //     // console.log("search system_parameter = undefined is "+data.values);
                    // })
                    var queryLeaveRoleByLevel = new LeaveRoleByLevel();
                    // queryLeaveRoleByLevel.system_parameter = 7;//揭開測試另一筆資料
                    // queryLeaveRoleByLevel.system_parameter = null;//揭開測試另一筆資料
                    //測試方法1
                    // LeaveService.getLeaveRoleByLevelByCondition(queryLeaveRoleByLevel, function(rtnData) {
                    //     callback();
                    // });
                    LeaveRoleByLevel.find({},
                        function(err, lrbl_data) {
                            console.log("lrbl_data is " + lrbl_data + "|end");
                            callback();
                        });
                }
            }, function(err, results) {
                done();
            });

        });
    });


    // describe('#getCompany(companyobj, function(data)) ', function() {
    //     it('getCompany ', function(done) {
    //         var companyData = newCompany();
    //         async.series({
    //             setCompany: function(callback) {
    //                 CompanyService.setCompany(companyData, function(company_data) {
    //                     (company_data.values).should.be.equal(companyData._id);
    //                     CompanyService.getCompany(0, function(company_val) {
    //                         (company_val.values).should.be.a('Array');
    //                         callback();
    //                     });
    //                 });
    //             }
    //         }, function(err, results) {
    //             done();
    //         });

    //     });
    // });

    // describe('#setCompanyById(companyobj, function(data)) ', function() {
    //     it('setCompanyById ', function(done) {
    //         var companyData = newCompany();
    //         async.series({
    //             setCompany: function(callback) {
    //                 CompanyService.setCompany(companyData, function(company_data) {
    //                     (company_data.values).should.be.equal(companyData._id);

    //                     companyData.address = "test";
    //                     CompanyService.setCompanyById(companyData, function(company_val) {
    //                         (company_val.values.address).should.be.equal(companyData.address);
    //                         callback();
    //                     });
    //                 });
    //             }
    //         }, function(err, results) {
    //             done();
    //         });

    //     });
    // });

    // describe('#setLeaveDefVal(new_system_parameter, function(data)) ', function() {
    //     it('setLeaveDefVal ', function(done) {
    //         async.series({
    //             setLeave: function(callback) {
    //                 var newLeaveRoleByLevel = new LeaveRoleByLevel();
    //                 newLeaveRoleByLevel._id = "test";
    //                 // newLeaveRoleByLevel.system_parameter=null;//第一筆資料故意讓他缺少
    //                 newLeaveRoleByLevel.leave_type_id = "test003";
    //                 newLeaveRoleByLevel.level = 3;
    //                 newLeaveRoleByLevel.use_days = 3660;

    //                 LeaveService.setLeaveRoleByLevel(newLeaveRoleByLevel, function(returnData) {
    //                     console.log("returnData1=" + returnData.values);


    //                     var newLeaveRoleByLevel2 = new LeaveRoleByLevel();
    //                     newLeaveRoleByLevel2._id = "test2";
    //                     newLeaveRoleByLevel2.system_parameter = 7;
    //                     newLeaveRoleByLevel2.leave_type_id = "test007";
    //                     newLeaveRoleByLevel2.level = 10;
    //                     newLeaveRoleByLevel2.use_days = 7220;
    //                     LeaveService.setLeaveRoleByLevel(newLeaveRoleByLevel2, function(returnData2) {
    //                         console.log("returnData2=" + returnData2.values);

    //                         // var queryLeaveRoleByLevel = new LeaveRoleByLevel();
    //                         // console.log("search condition...queryLeaveRoleByLevel=" + queryLeaveRoleByLevel);
    //                         // CompanyService.setLeaveDefVal(queryLeaveRoleByLevel,function (data) {
    //                         //     // console.log("search system_parameter = undefined is "+data.values);
    //                         // })
    //                         var queryLeaveRoleByLevel = new LeaveRoleByLevel();
    //                         // queryLeaveRoleByLevel.system_parameter = 7;//揭開測試另一筆資料
    //                         // queryLeaveRoleByLevel.system_parameter = null;//揭開測試另一筆資料
    //                         //測試方法1
    //                         LeaveService.getLeaveRoleByLevelByCondition(queryLeaveRoleByLevel, function(rtnData) {
    //                             callback();
    //                         });
    //                     });
    //                 });

    //             }
    //         }, function(err, results) {
    //             done();
    //         });

    //     });
    // });
});
