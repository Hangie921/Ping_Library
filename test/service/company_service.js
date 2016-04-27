var async = require('async');
var should = require('chai').should();
var mongoose = require('mongoose');
var mongodb = null;

// mongodb = 'mongodb://localhost/test';
mongodb = 'mongodb://192.168.60.65/unitest';

var pinglib = require('../../index.js');
var Company = pinglib.Company;
var CompanyService = pinglib.CompanyService;

function output(msg) {
    if (true)
        console.log(msg);
}
describe('CompanyService', function() {
    function newCompany() {
        var company = new Company();
        company._id="ping_team";
        company.system_parameter = 0;
        company.id_number = "55667788"
        company.name = 'Ping製作團隊';
        company.address = '新北市鬧區';
        company.url = 'http://ping.com.tw';
        return company;
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
                }
            }, function(err, results) {
                done();
            });

        });
    });


    describe('#getCompany(companyobj, function(data)) ', function() {
        it('getCompany ', function(done) {
            var companyData = newCompany();
            async.series({
                setCompany: function(callback) {
                    CompanyService.setCompany(companyData, function(company_data) {
                        (company_data.values).should.be.equal(companyData._id);
                        CompanyService.getCompany( function(company_val) {
                            (company_val.values).should.be.a('Array');
                            callback();
                        });
                    });
                }
            }, function(err, results) {
                done();
            });

        });
    });
});
