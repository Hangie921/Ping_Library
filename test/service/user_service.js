var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

mongodb = 'mongodb://localhost/test';
// mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var User = pinglib.User;
var UserService = pinglib.UserService;

function output(msg) {
    if (true)
        console.log(msg);
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
