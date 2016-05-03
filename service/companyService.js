//--DEFINE---
var Company = require('../bean/company');
var response = require('../common/response');
var mongoose = require('mongoose');

//--PUBLIC FUNCTION---
//未做unitest
var fun_setCompanyById = function(companyobj, callback) {
    Company.findByIdAndUpdate(companyobj._id, companyobj, { new: true }, function(err, data) {
        if (err) throw err;
        rtn = response.OK;
        rtn.values = data;
        callback(rtn);
    });
}

var fun_setCompany = function(companyobj, callback) {
    companyobj.save(function(err, company) {
        var rtn = response.OK;
        rtn.values = company._id;
        callback(rtn);
    });
}

var fun_getCompany = function(callback) {
    Company.find({}, 
            function(err, data) {
        if (err) throw err;
        var resault = null;
        if (null != data) {
            resault = response.OK;
            resault.values = data;
            callback(resault);
        } else {
            resault = response.No_Results;
            callback(resault);
        }
    });
}

var fun_getCompanyById = function(company_id, callback) {
    Company.findById({
        _id: company_id
    }, function(err, data) {
        if (err) throw err;
        var resault = null;
        if (null != data) {
            resault = response.OK;
            resault.values = data;
            callback(resault);
        } else {
            resault = response.No_Results;
            callback(resault);
        }
    });
}


//--EXPORT---
exports.setCompanyById = fun_setCompanyById;
exports.setCompany = fun_setCompany;
exports.getCompanyById = fun_getCompanyById;
exports.getCompany = fun_getCompany;

