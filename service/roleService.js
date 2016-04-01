//--DEFINE---
var roleobj = require('../bean/role');


//--PUBLIC FUNCTION---
var fun_getRole = function(obj,callback){
	roleobj.find({ 
		// _id:_roleobj._id,
		system_parameter:obj.system_parameter,
	}, function(err, obj) {
	  if (err) {
	  	// Call callback function with error
    	return callback(err);
	  }
	  console.log("Role findOne="+obj);
	  callback(null,obj);
	});
}


//--EXPORT---
exports.getRole = fun_getRole;