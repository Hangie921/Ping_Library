var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

// mongodb = 'mongodb://localhost/test';
mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var Group = pinglib.Group;
var User = pinglib.User;
var GroupService = pinglib.GroupService;

function output(msg) {
    if (true)
        console.log(msg);
}

describe('GroupService', function() {
    function newUser() {
        var user = new User();
        user.system_parameter = 0;
        user.id_number = "god"
        user.email = 'god@ping.com.sg';
        user.name = '上帝';
        user.pwd = '!QAZ@WSX';
        return user;
    }


    function newGroup1() {
        var group = new Group();
        group._id = "hr1";
        group.system_parameter = 0;
        group.parent_id = null;
        group.name = "人力資源部";
        return group;
    }

    function newGroup1_1() {
        var group = new Group();
        group._id = "hr1_1";
        group.system_parameter = 0;
        group.parent_id = 'hr1';
        group.name = "會計組";
        return group;
    }

    function newGroup1_2() {
        var group = new Group();
        group._id = "hr1_2";
        group.system_parameter = 0;
        group.parent_id = 'hr1';
        group.name = "招募組";
        return group;
    }

    function newGroup2() {
        var group = new Group();
        group._id = "mis1";
        group.system_parameter = 0;
        group.parent_id = null;
        group.name = "MIS 部";
        return group;
    }

    function newGroup2_1() {
        var group = new Group();
        group._id = "mis1_1";
        group.system_parameter = 0;
        group.parent_id = 'mis1';
        group.name = "軟體工程組";
        return group;
    }

    function newGroup2_2() {
        var group = new Group();
        group._id = "mis1_2";
        group.system_parameter = 0;
        group.parent_id = 'mis1';
        group.name = "硬體工程組";
        return group;
    }

    beforeEach(function(done) {
        function clearDB() {
            for (var i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function() {});
            }
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

    describe('#group base process ', function() {
        it('single case ', function(done) {
            var groupRtn = null;
            async.series({
                save: function(callback) {
                    GroupService.setGroup(newGroup1(), function(data) {
                        (data.code).should.be.equal(200);
                        groupRtn = data;
                        callback();
                    });
                },
                update: function(callback) {
                    var changeVal = "single test case";
                    groupRtn.values.name = changeVal;
                    GroupService.setGroupById(groupRtn.values, function(data) {
                        (data.code).should.be.equal(200);
                        (data.values).should.be.a('object');
                        (data.values.name).should.be.equal(changeVal);
                        callback();
                    });
                },
                get: function(callback) {
                    GroupService.getGroup(0, function(data) {
                        (data[0]._id).should.be.equal(newGroup1()._id);
                        callback();
                    });
                }
            }, function(err, results) {
                done();
            });

        });
    });


    describe('#group base process ', function() {
        it('mulit case ', function(done) {
            var groupRtn = null;
            async.series({
                save: function(callback) {
                    GroupService.setGroup(newGroup1(), function(data1) {
                        (data1.code).should.be.equal(200);
                        groupRtn = data1;
                        GroupService.setGroup(newGroup1_1(), function(data2) {
                            GroupService.setGroup(newGroup1_2(), function(data3) {
                                GroupService.setGroup(newGroup2(), function(data4) {
                                    GroupService.setGroup(newGroup2_1(), function(data5) {
                                        GroupService.setGroup(newGroup2_2(), function(data6) {
                                            callback();
                                        });
                                    });
                                });
                            });
                        });
                    });
                },
                get: function(callback) {
                    GroupService.getGroup(0, function(data) {
                        (data).should.be.a('array');
                        (data[0]).should.have.property('group').with.lengthOf(2);
                        callback();
                    });
                },
                getList: function(callback) {
                    GroupService.getGroupList(0, function(data) {
                        (data).should.be.a('array');
                        callback();
                    });
                }
            }, function(err, results) {
                done();
            });

        });
    });

});
