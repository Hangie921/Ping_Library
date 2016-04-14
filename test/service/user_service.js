var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;


if (process.argv[2] == '--local') {
    mongodb = 'mongodb://localhost/test';
} else {
    mongodb = 'mongodb://192.168.60.65/unitest';
}

var pinglib = require('../../index.js');
var User = pinglib.User;
var UserService = pinglib.UserService;

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

    beforeEach(function(done) {
        function clearDB() {
            for (var i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function() {});
            }
            // console.log("cleanDB()");
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

    describe('#customizeUser(user, function(data))', function() {
        it('update a custom data for "God" ', function(done) {

            // @Bug : need try multuple save()
            var testUser = newUser();
            async.series({
                save: function(callback) {
                    testUser.save(function(err, user) {
                        console.log("save user = " + user._id);
                        callback();
                    });
                },
                update: function(callback) {
                    testUser.custom = { _company: '1234' };
                    (testUser).should.be.a('object');
                    // console.log(testUser.custom);
                    testUser.should.have.deep.property('custom._company', '1234');
                    UserService.customizeUser(testUser, function(data) {
                        (data.values).should.be.a('object');
                        (data.values.system_parameter).should.be.equal(testUser.system_parameter);
                        (data.values.id_number).should.be.equal(testUser.id_number);
                        (data.values.email).should.be.equal(testUser.email);
                        (data.values.name).should.be.equal(testUser.name);
                        (data.values.pwd).should.be.equal(testUser.pwd);
                        // (data.values).should.have.property('custom','_company');
                        callback();
                    })
                }
            }, function(err, results) {
                // console.log("res", results);
                done();
            });

        });
    });
});
