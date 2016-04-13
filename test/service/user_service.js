var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = 'mongodb://localhost/test';

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
            async.series({
                save: function(callback) {
                    var testUser = newUser();
                    testUser.save(function(err, user) {
                        callback();
                    });
                },
                update: function(callback) {
                    var testUser = newUser();
                    testUser.custom = { _company: '1234' };
                    (testUser).should.be.a('object');
                    // console.log(testUser.custom);
                    testUser.should.have.deep.property('custom._company', '1234');

                    UserService.customizeUser(testUser, function(data) {
                        (data).should.be.a('object');
                        (data.system_parameter).should.be.equal(testUser.system_parameter);
                        (data.id_number).should.be.equal(testUser.id_number);
                        (data.email).should.be.equal(testUser.email);
                        (data.name).should.be.equal(testUser.name);
                        (data.pwd).should.be.equal(testUser.pwd);
                        (data).should.hava.property('custom');
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
