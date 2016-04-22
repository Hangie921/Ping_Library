var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

// mongodb = 'mongodb://localhost/test';
mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var User = pinglib.User;
var Menu = pinglib.Menu;
var Role = pinglib.Role;
var MenuService = pinglib.MenuService;
var UserService = pinglib.UserService;
var RoleService = pinglib.RoleService;

function output(msg) {
    if (true)
        console.log(msg);
}

describe('MenuService', function() {
    function newMenuRoot() {
        var menu = new Menu();
        menu._id = "floor_1";
        menu.parent_id = null;
        menu.system_parameter = 0;
        menu.name = "第一層"
        menu.url = 'http:\\test';
        return menu;
    }

    function newMenuSecond_1() {
        var menu = new Menu();
        menu._id = "floor_1_1";
        menu.parent_id = "floor_1";
        menu.system_parameter = 0;
        menu.name = "第二層 1號房"
        menu.url = 'http:\\test';
        return menu;
    }

    function newMenuSecond_2() {
        var menu = new Menu();
        menu._id = "floor_1_2";
        menu.parent_id = "floor_1";
        menu.system_parameter = 0;
        menu.name = "第二層 2號房"
        menu.url = 'http:\\test';
        return menu;
    }

    function testUser() {
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
        role.is_god=true;
        role.menu=["floor_1_1","floor_1_2","floor_1"];
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

    describe('#setMenu(menuobj, function(data))', function() {
        it('create menu', function(done) {

            // @Bug : need try multuple save()
            var menu1 = newMenuRoot();
            async.series({
                save: function(callback) {
                    MenuService.setMenu(menu1, function(data) {
                        (data.values._id).should.be.equal('floor_1');
                        callback();
                    });
                }
            }, function(err, results) {
                // output("res", results);
                done();
            });

        });
    });

    describe('#getMenu(menuobj, function(data))', function() {
        it('get menu by system_parameter', function(done) {

            // @Bug : need try multuple save()
            var menu1 = newMenuRoot();
            var menu1_1 = newMenuSecond_1();
            var menu1_2 = newMenuSecond_2();
            async.series({
                save: function(callback) {
                    MenuService.setMenu(menu1, function(data) {
                        MenuService.setMenu(menu1_1, function(data2) {
                            MenuService.setMenu(menu1_2, function(data3) {
                                callback();
                            });
                        });
                    });
                },
                get: function(callback) {
                    var userReg = new User({
                        system_parameter: 0
                    });
                    MenuService.getMenu(userReg, function(data) {
                        (data).should.be.a('array');
                        callback();
                    });
                }
            }, function(err, results) {
                // output("res", results);
                done();
            });

        });
    });

    describe('#getMenuByUser(obj, function(data))', function() {
        it('get menu by user', function(done) {

            // @Bug : need try multuple save()
            var menu1 = newMenuRoot();
            var menu1_1 = newMenuSecond_1();
            var menu1_2 = newMenuSecond_2();
            // var roledata = newRole();
            var newUser = testUser();
            var roleData = [{
                "system_parameter": 0,
                "name": "testRole",
                "is_god": false,
                "menu": ["floor_1", "floor_1_1", "floor_1_2"]
            }];
            // var newUser = newUser();
            async.series({
                save: function(callback) {
                    MenuService.setMenu(menu1, function(data) {
                        MenuService.setMenu(menu1_1, function(data2) {
                            MenuService.setMenu(menu1_2, function(data3) {
                                Role.collection.insertMany(roleData, function(err, r) {

                                    newUser.role = r.insertedIds[0];
                                    newUser.save(function(argument) {
                                        if (err) throw err;
                                        callback();
                                    });
                                });
                            });
                        });
                    });
                },
                get: function(callback) {
                    MenuService.getMenuByUser(newUser, function(data) {
                        (data).should.be.a('array');
                        (data[0]).should.have.property('menu').with.lengthOf(2);
                        callback();
                    });
                }
            }, function(err, results) {
                // output("res", results);
                done();
            });

        });
    });
});
