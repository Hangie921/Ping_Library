//--DEFINE---
var Group = require('../bean/group');
var response = require('../common/response');
var mongoose = require('mongoose');

//--PUBLIC FUNCTION---
var fun_setGroup = function(groupobj, callback) {
    groupobj.save(function (err,group) {
        if (err) throw err;
        callback(response.obj(response.codeEnum.OK,group));
    });
}

var fun_getGroup = function(system_parameter, callback) {
    Group.find({
		system_parameter:system_parameter
	}, function(err, data) {
	  	if (err) throw err;
	  	if(null!=data){
	  		callback(response.obj(response.codeEnum.OK,data));
	  	}else{
	  		callback(response.obj(response.codeEnum.No_Results,null,'no results'));
	  	}
	});
}

var fun_setGroupById = function(groupobj, callback) {
    Group.findByIdAndUpdate(groupobj._id,groupobj,{new: true},function (err,data) {
    	if (err) throw err;
    	callback(response.obj(response.codeEnum.OK, data));
    });
}


exports.setGroup = fun_setGroup;
exports.getGroup = fun_getGroup;
exports.setGroupById = fun_setGroupById;