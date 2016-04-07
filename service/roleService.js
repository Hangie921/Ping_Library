//--DEFINE---
var roleobj = require('../bean/roles');
var response = require('../common/response');
var mongoose = require('mongoose');

//--PUBLIC FUNCTION---
var fun_getRoleBySys = function(sys_parameter,callback){
	// console.log(sys_parameter);
	roleobj.findOne({
		system_parameter:sys_parameter
	}, function(err, data) {
	  	if (err) throw err;
	  	if(null!=data){
	  		callback(response.obj(response.codeEnum.OK,data));
	  	}else{
	  		callback(response.obj(response.codeEnum.No_Results,null));
	  	}
	});
}
var fun_getRoleFunByUser = function(obj,callback){
	var ids = [];
	if(null!=obj){
		for(var fm in obj.values){
			ids.push(obj.values[fm].role);
		}

		roleobj.find({
			_id:{$in:ids}
		}, function(err, obj) {
			if (err) {
		    	return callback(err);
			}
			// console.log(obj);
			if(null!=obj){

				var outputArray = [];
				for(var roleIndex in obj){
					// console.log(obj[roleIndex]);
					getUnique(outputArray,obj[roleIndex].function);
				}
				callback(response.obj(response.codeEnum.OK,outputArray));
			}else{
				callback(response.obj(response.codeEnum.No_Results,null));
			}
		});
	}
}


//--private function

//取得不重覆參數
function getUnique(outputArray,inputArray) {
	for (var i = 0; i < inputArray.length; i++) {
		if(outputArray.indexOf(inputArray[i]) == -1){
			outputArray.push(inputArray[i]);
		}
	}
}


//--EXPORT---
exports.getRoleBySys = fun_getRoleBySys;
exports.getRoleFunByUser = fun_getRoleFunByUser;