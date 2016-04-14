//--DEFINE---
var Role = require('../bean/roles');
var response = require('../common/response');
var mongoose = require('mongoose');

//--PUBLIC FUNCTION---
var fun_getRoleById = function(role_id,callback){
	// console.log("fun_getRoleById="+role_id);
	///這段搭配 myTest.js role_id_ary多筆  會有問題  再試試看
	//try async *******
	Role.findById({
		// _id:{$in:role_id}
		_id:role_id
	}, function(err, data) {
		// console.log("fun_getRoleById return = "+data);
	  	if (err) throw err;
	  	if(null!=data){
	  		callback(response.obj(response.codeEnum.OK,data));
	  	}else{
	  		callback(response.obj(response.codeEnum.No_Results,null));
	  	}
	});
}

var fun_getRoleBySys = function(sys_parameter,callback){
	// console.log(sys_parameter);
	Role.find({
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
	// console.log("role.obj=="+obj.values);
	if(null!=obj){
		for(var fm in obj.values){
			// console.log("push ids=="+obj.values[fm].role);
			ids.push(obj.values[fm].role);
		}
		// console.log("ids=="+ids);

		Role.find({
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
exports.getRoleById = fun_getRoleById
exports.getRoleBySys = fun_getRoleBySys;
exports.getRoleFunByUser = fun_getRoleFunByUser;