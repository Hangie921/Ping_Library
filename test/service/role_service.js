var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

// mongodb = 'mongodb://localhost/test';
mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var Role = pinglib.Role;
var User = pinglib.User;
var RoleService = pinglib.RoleService;

function output(msg) {
    if (true)
        console.log(msg);
}

describe('RoleService', function() {
    function newUser() {
        var user = new User();
        user.system_parameter = 0;
        user.id_number = "god"
        user.email = 'god@ping.com.sg';
        user.name = '上帝';
        user.pwd = '!QAZ@WSX';
        return user;
    }


    function newRole() {
        var role = new Role();
        role.system_parameter = 0;
        role.name = "GOD";
        role.is_god = true;
        role.menu = ["floor_1_1", "floor_1_2", "floor_1"];
        return role;
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

    describe('#setRole(roleobj, function(data)) getRole(role_id,function(data))', function() {
        it('setRole & getRoleById ', function(done) {
            var roledata = newRole();
            async.series({
                setRole: function(callback) {
                    RoleService.setRole(roledata, function(role_data) {
                        (role_data.values).should.be.a('object');
                        RoleService.getRoleById(role_data.values, function(role_val) {
                            (role_val.values).should.be.a('object');
                            RoleService.getRoleBySys(roledata.system_parameter, function(sys_data) {
                                (sys_data.values[0]._id+"").should.be.equal(role_val.values[0]._id+"");
                                callback();
                            });
                        });
                    });
                }
            }, function(err, results) {
                done();
            });

        });
    });


    describe('#getRoleFunByUser(userobj, function(data))', function() {
        it('get RoleFunByUser', function(done) {
            var testUser = newUser();
            async.series({
                save: function(callback) {
                    newUser().save(function(err, user) {
                        callback();
                    });
                },
                run: function(callback) {
                    RoleService.getRoleFunByUser(newUser(),function (data) {
                        (data.code).should.be.equal(200);
                        callback();
                    });
                }
            }, function(err, results) {
                done();
            });

        });
    });
});
