//--DEFINE---
var Menu = require('../bean/menu');

var userService = require('./userService');
var roleService = require('./roleService');

//將所有MENU資料暫存於此
var hashMenu = null;
//--PUBLIC FUNCTION---
var fun_getMenu = function(obj, callback) {
    Menu.find({
        system_parameter: obj.system_parameter,
        // parent_id:obj.parent_id
    }, function(err, obj) {
        if (err) {
            throw err; }
        //暫存資料
        hashMenu = obj;
        //根節點儲存陣列
        var menuRootAry = [];
        //依照根結點為開始塞入資料搜尋
        // console.log("obj="+obj);
        for (var key in obj) {
            if (obj[key].parent_id == null) {
                menuRootAry.push(obj[key]);
                getMenuByParentId(obj[key]);
            }
        }
        // console.log("menuRootAry="+menuRootAry);
        callback(menuRootAry);
    });
}

var user_menu_list = null;
var fun_getMenuByUser = function(obj, callback) {

    userService.getUser(obj, function(user_data) {
        // console.log("user_data=="+user_data.values[0]);
        roleService.getRoleFunByUser(user_data, function(role_by_user_data) {
            // console.log("role_by_user_data=="+role_by_user_data.values);
            //全部function
            fun_getMenu(user_data.values[0], function(all_fun_data) {
                // console.log("all_fun_data(step1)="+all_fun_data);
                //使用者傭有的功能 將會被存入user_menu_list
                user_menu_list = [];
                //驗證所有menu的權限
                verifyMenuByUser(user_data, role_by_user_data, all_fun_data);
                // console.log("all_fun_data(step2)="+all_fun_data);
                // console.log(user_menu_list);
                //根節點儲存陣列
                var menuRootAry = [];

                //依照根結點為開始塞入資料搜尋
                // console.log("obj="+obj);
                for (var key in user_menu_list) {
                    if (user_menu_list[key].parent_id == null) {
                        // console.log(user_menu_list[key]);
                        menuRootAry.push(user_menu_list[key]);
                        getMenuByParentId(user_menu_list[key]);
                    }
                }
                // console.log("all_fun_data(step3)=" + all_fun_data);

                // console.log("menuRootAry="+menuRootAry);
                callback(menuRootAry);

            });
        });
    });

}

//驗證所有"MENU功能"權限
function verifyMenuByUser(user_data, role_by_user_data, all_fun_data) {
    // console.log("all_fun_data(step4)=" + all_fun_data);
    if (all_fun_data.length > 0) {
        for (var i = 0; i < all_fun_data.length; i++) {
            //將role沒有的function移除
            // console.log("=SSSS="+i+"===");
            // console.log(role_by_user_data.values);
            // console.log(all_fun_data[i]._id);
            // console.log(role_by_user_data.values.indexOf(all_fun_data[i]._id) != -1);
            // console.log("=EEEE="+i+"===");
            if (role_by_user_data.values.indexOf(all_fun_data[i]._id) != -1) {
                // console.log("push"+all_fun_data[i]);
                user_menu_list.push(all_fun_data[i]);
                verifyMenuByUser(user_data, role_by_user_data, all_fun_data[i].menu);
            }
        }
    }
}

/**
 * 向下搜尋物件
 **/
function getMenuByParentId(obj) {
    var fhm = null;
    //找出該層是否還有下層，有下層 則向下取物
    if (fhm = findHashMenu_id(obj._id, obj)) {
        //物件存在 向下取件
        for (var key in fhm) {
            getMenuByParentId(fhm[key]);
        }
    }
}

/**
 * 由hashMenu取出下層物件 在 將物件塞入子節點
 * _id 物件
 * obj 為上層物件
 **/
function findHashMenu_id(_id, obj) {
    // console.log("abc=="+obj);
    var rtnAry = new Array();
    // console.log(hashMenu);
    for (var key in hashMenu) {
    	// console.log(hashMenu[key].parent_id+"=="+_id);
        if (hashMenu[key].parent_id == _id) {
            //將物件塞入此目錄下的子節點
            // console.log("push==>"+hashMenu[key]);
            obj.menu.push(hashMenu[key]);
            rtnAry.push(hashMenu[key]);
        }
    }
    return rtnAry.length > 0 ? rtnAry : null;
}

//驗證使用者連結可用性
var fun_verifyAvailabilityForUserUrl = function(callback) {

}

//--EXPORT---
exports.getMenu = fun_getMenu;
exports.getMenuByUser = fun_getMenuByUser;
exports.verifyAvailabilityForUserUrl = fun_verifyAvailabilityForUserUrl;
