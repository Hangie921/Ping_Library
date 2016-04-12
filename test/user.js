var async = require('async');
var should = require('should');
var mongoose = require('mongoose');
var mongodb = 'mongodb://localhost/test';

var User = require('../bean/users.js');

describe('User', function() {
    var testUser = new User();
    testUser.system_parameter = 0;
    testUser.id_number = "god"
    testUser.email = 'god@ping.com.sg';
    testUser.name = '上帝';
    testUser.pwd = '!QAZ@WSX';
    testUser.function_crud = '!QAZ@WSX';

    beforeEach(function(done) {
        function clearDB() {
            for (var i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function() {});
            }
            console.log("cleanDB()");
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


    afterEach(function(done) {
        mongoose.disconnect();
        return done();
    });

    describe('#say()', function() {
        it('should return God name + "-dude"', function(done) {
            (testUser.say()).should.be.exactly('上帝-dude').and.be.a.String();
            done();
        });
    });
    describe('#save()', function() {
        it('should return a Object', function(done) {
            testUser.save(function(err, user) {
                console.log(user);
                (user).should.be.a.Object();
                // console.log("err.msg", err.message)
                // console.log("err", err)
                done();
            });
        });
        it('should return a error msg when user is already existed', function(done) {

            // @Bug : need try multuple save()
            async.series({
                    one: function(callback) {
                        testUser.save(function(err, user) {
                            console.log(user);
                            // (user).should.be.a.Object();
                            // console.log("err.msg", err.message)
                            console.log("err", err)
                        });
                        callback(null, 1);
                    },
                    two: function(callback) {

                        testUser.save(function(err, user) {
                            console.log(user);
                            // (user).should.be.a.Object();
                            // console.log("err.msg", err.message)
                            console.log("err", err)
                        });
                        callback(null, 2);
                    }
                },
                function(err, results) {
                    if (err) {
                        console.log("err", err)
                    }
                    // results is now equal to: {one: 1, two: 2}
                    done();
                    console.log(results);
                });

            // testUser.save(function(err, user) {
            //     console.log(user);
            //     // (user).should.be.a.Object();
            //     // console.log("err.msg", err.message)
            //     console.log("err", err);
            // });
        });
    });
});
