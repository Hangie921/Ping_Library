//--DEFINE---
var functionobj = require('../bean/function');


//--PUBLIC FUNCTION---
var fun_getFunction = function(obj,callback){
	functionobj.find({
		system_parameter:obj.system_parameter,
		parent_id:obj.parent_id
	}, function(err, obj) {
	  if (err) {throw err;}
	  console.log("Function findOne="+obj);
	  
	  getFunctionByParentId(obj);

	  callback(null,obj);

	  //以此OBJ 的_id 下去找尋  parent_id為 obj._id
	});
}


function getFunctionByParentId(obj){
	
}



//--EXPORT---
exports.getFunction = fun_getFunction;