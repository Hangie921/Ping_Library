var config = require('../example/config/config').config();
var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = config.unitestdb;

var pinglib = require('../index.js');
var User = pinglib.User;

describe('User', function() {
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

    describe('#say()', function() {
        it('should return God name + "-dude"', function(done) {
            var testUser = newUser();
            (testUser.say()).should.equal('上帝-dude');
            // (testUser.say()).should.be.a.null;
            done();
        });
    });

    describe('#save()', function() {
        it('should return a Object', function(done) {
            var testUser = newUser();
            testUser.save(function(err, user) {
                (user).should.be.a('object');
                (user.system_parameter).should.be.a('number');
                (user.id_number).should.be.a('string');
                (user.name).should.be.a('string');
                (user.email).should.be.a('string');
                (user.pwd).should.be.a('string');
                done();
            });
        });
        it('should return a error msg when user is already existed', function(done) {

            // @Bug : need try multuple save()
            async.series({
                save: function(callback) {
                    var testUser = newUser();
                    testUser.save(function(err, user) {
                        callback();
                    });
                },
                errorSave: function(callback) {
                    var testUser = newUser();
                    testUser.save(function(err, user) {
                        (err.errmsg).should.not.be.null;
                        (err.errmsg).should.contain('duplicate');
                        callback(null, err.errmsg);
                    });
                }
            }, function(err, results) {
                // console.log("res", results);
                done();
            });

        });
    });

});
