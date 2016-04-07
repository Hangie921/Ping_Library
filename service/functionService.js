//--DEFINE---
var functionobj = require('../bean/function');

var userService = require('./userService');
var roleService = require('./roleService');

//將所有MENU資料暫存於此
var hashMenu = null;
//--PUBLIC FUNCTION---
var fun_getFunction = function(obj,callback){
	functionobj.find({
		system_parameter:obj.system_parameter,
		// parent_id:obj.parent_id
	}, function(err, obj) {
	  if (err) {throw err;}
	  	//暫存資料
		hashMenu = obj;
		//根節點儲存陣列
		var funcRootAry=[];
		//依照根結點為開始塞入資料搜尋
		for(var key in obj){
			if(obj[key].parent_id == null){
				funcRootAry.push(obj[key]);
				getFunctionByParentId(obj[key]);
			}
		}

	  	callback(funcRootAry);
	});
}

// var fun_getFunctionByUser = function(obj,callback){


// 	functionobj.find({
// 		system_parameter:obj.system_parameter,
// 		// parent_id:obj.parent_id
// 	}, function(err, obj) {
// 	  if (err) {throw err;}
// 	  	//暫存資料
// 		hashMenu = obj;
// 		//根節點儲存陣列
// 		var funcRootAry=[];
// 		//依照根結點為開始塞入資料搜尋
// 		for(var key in obj){
// 			if(obj[key].parent_id == null){
// 				funcRootAry.push(obj[key]);
// 				getFunctionByParentId(obj[key]);
// 			}
// 		}

// 	  	callback(funcRootAry);
// 	});
// }

/**
* 向下搜尋物件
**/
function getFunctionByParentId(obj){
	var fhm = null;
	//找出該層是否還有下層，有下層 則向下取物
	if(fhm = findHashMenu_id(obj._id,obj)){
		//物件存在 向下取件
		for(var key in fhm){
			getFunctionByParentId(fhm[key]);
		}
	}
}

/**
* 由hashMenu取出下層物件 在 將物件塞入子節點
* _id 物件
* obj 為上層物件
**/
function findHashMenu_id(_id,obj){
	var rtnAry = new Array();
	for(var key in hashMenu){
		if(hashMenu[key].parent_id==_id){
			//將物件塞入此目錄下的子節點
			obj.function.push(hashMenu[key]);
			rtnAry.push(hashMenu[key]);
		}
	}
	return rtnAry.length>0?rtnAry:null;
}



//--EXPORT---
exports.getFunction = fun_getFunction;