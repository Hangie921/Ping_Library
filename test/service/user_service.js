var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

// mongodb = 'mongodb://localhost/test';
mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var User = pinglib.User;
var Role = pinglib.Role;
var UserService = pinglib.UserService;
var RoleService = pinglib.RoleService;

function output(msg) {
    // if (true)
    // console.log(msg);
}




describe('UserService', function() {
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

    describe('#user process..', function() {
        it('', function(done) {
            var testUser = newUser();
            var saveUser = null;
            async.series({
                registered: function(callback) {
                    UserService.registered(testUser, function(data) {
                        saveUser = data;
                        (data.code).should.be.equal(200);
                        (data.values).should.be.a('object');
                        callback();
                    })
                },
                update: function(callback) {
                    testChange = 'my god';
                    saveUser.values.id_number = testChange;
                    UserService.setUserById(saveUser.values, function(data) {
                        (data.code).should.be.equal(200);
                        (data.values).should.be.a('object');
                        (data.values.id_number).should.be.equal(testChange);
                        callback();
                    });
                },
                email_check: function(callback) {
                    UserService.emailCheck(testUser, function(data) {
                        (data.code).should.be.equal(200);
                        (data.values).should.be.equal(true);
                        callback();
                    });
                },
                setMenuCrud: function(callback) {
                    UserService.getUser(testUser, function(userObj) {
                        var menu_crud_array = [
                            { menu_id: "rootno01", "create": true, "read": true, "update": true, "delete": true, "disable": false },
                            { menu_id: "rootno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
                        ];
                        UserService.setMenuCrud(userObj, menu_crud_array, function(data) {
                            (data.values).should.have.property('menu_crud').with.lengthOf(menu_crud_array.length);
                            callback();
                        });
                    });
                },
                setUserRole: function(callback) {
                    //此測試項目 預設假資料
                    RoleService.setRole(newRole(), function(cbRole) {
                        var temp_cbRole = clone(cbRole);
                        //由前端畫面傳回roleid 並確認資料正確性
                        RoleService.getRoleById(temp_cbRole.values, function(roleDate) {
                            var temp_roleDate = new clone(roleDate);
                            //由UserService 取得user info
                            UserService.getUser(testUser, function(userObj) {
                                var temp_userObj = new clone(userObj);
                                //由UserService取得User物件 以及搭配 前端畫面傳回json 或 組合後的array roleid 查詢
                                UserService.setUserRole(temp_userObj, temp_roleDate, function(rtnUserObj) {
                                    (rtnUserObj.values.role + "").should.be.equal(temp_cbRole.values + "");
                                    callback();
                                });
                            });
                        });

                    });
                }
            }, function(err, results) {
                done();
            });

        });
    });

    describe('#customizeUser(user, function(data))', function() {
        it('update a custom data for "God" ', function(done) {

            // @Bug : need try multuple save()
            var testUser = newUser();
            async.series({
                save: function(callback) {
                    testUser.save(function(err, user) {
                        output("save user = " + user._id);
                        callback();
                    });
                },
                update: function(callback) {
                    testUser.custom = { _company: '1234' };
                    (testUser).should.be.a('object');
                    // output(testUser.custom);
                    testUser.should.have.deep.property('custom._company', '1234');
                    UserService.customizeUser(testUser, function(data) {
                        (data.values).should.be.a('object');
                        (data.values.system_parameter).should.be.equal(testUser.system_parameter);
                        (data.values.id_number).should.be.equal(testUser.id_number);
                        (data.values.email).should.be.equal(testUser.email);
                        (data.values.name).should.be.equal(testUser.name);
                        (data.values.pwd).should.be.equal(testUser.pwd);
                        // (data.values).should.have.property('custom','_company');
                        (data.values).should.have.deep.property('custom._company', '1234');
                        callback();
                    })
                }
            }, function(err, results) {
                // output("res", results);
                done();
            });

        });
    });

    describe('#getUserAll(user, function(data))', function() {

        var Company = mongoose.model('company', new mongoose.Schema({
            // _id: mongoose.Schema.Types.ObjectId,
            name: String,
            description: String
        }));

        var company = new Company();
        company.name = "Ping";
        company.description = "vary good";

        var user = newUser();
        user.custom = { _company: company._id };

        it('get user\'s all data include references', function(done) {
            async.series([
                function save(callback) {

                    user.save(company, function(err, data) {
                        // output("user = " + data);
                    });
                    company.save(company, function(err, data) {
                        // output("company = " + data);
                    });
                    callback();
                },
                function load(callback) {
                    var condition = {
                        company: "_company",
                        talent: "_talent"
                    };
                    user.getRefs(condition, function(data) {
                        output("getRef = " + data);
                    });
                    callback();
                }
            ], function(err, results) {
                done();
            })

        });
    });
});



function clone(src) {
    function mixin(dest, source, copyFunc) {
        var name, s, i, empty = {};
        for (name in source) {
            // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
            // inherited from Object.prototype.  For example, if dest has a custom toString() method,
            // don't overwrite it with the toString() method that source inherited from Object.prototype
            s = source[name];
            if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }
        return dest;
    }

    if (!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]") {
        // null, undefined, any non-object, or function
        return src; // anything
    }
    if (src.nodeType && "cloneNode" in src) {
        // DOM Node
        return src.cloneNode(true); // Node
    }
    if (src instanceof Date) {
        // Date
        return new Date(src.getTime()); // Date
    }
    if (src instanceof RegExp) {
        // RegExp
        return new RegExp(src); // RegExp
    }
    var r, i, l;
    if (src instanceof Array) {
        // array
        r = [];
        for (i = 0, l = src.length; i < l; ++i) {
            if (i in src) {
                r.push(clone(src[i]));
            }
        }
        // we don't clone functions for performance reasons
        //      }else if(d.isFunction(src)){
        //          // function
        //          r = function(){ return src.apply(this, arguments); };
    } else {
        // generic objects
        r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, clone);

}
