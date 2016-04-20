var User = require('../../bean/users');
var Role = require('../../bean/roles');
// var Function = require('../../bean/function');
var Menu = require('../../bean/menu');

var userService = require('../../service/userService');
var response = require('../../common/response');


var GOD_EMAIL = "god@ping.com.sg";
var GOD_NAME = "上帝";
var GOD_PWD = "!QAZ@WSX";
var GOD_SYS = 0;

var roleData = [{
    "system_parameter": 0,
    "name": "GOD",
    "is_god": true,
    "menu": [
        "rootno01",
        "rootno02",
        "settingno01", "settingno0101", "settingno0102", "settingno0103",
        "settingno02",
        "memberno01",
        "memberno02", "memberno03", "memberno0301"
    ]
}];

var adminRoleData = [{
    "system_parameter": 0,
    "name": "AMDIN",
    "menu": [
        "rootno01",
        // "rootno02",
        "settingno01", "settingno0101", "settingno0102", "settingno0103",
        // "settingno02",
        // "memberno01",
        // "memberno02","memberno03","memberno0301"
    ]
}];

var userRoleData = [{
    "system_parameter": 0,
    "name": "USER",
    "menu": [
        // "rootno01",
        "rootno02",
        // "settingno01","settingno0101","settingno0102","settingno0103",
        // "settingno02",
        "memberno01",
        "memberno02", "memberno03", "memberno0301"
    ]
}];


var god = [{
    "system_parameter": GOD_SYS,
    "id_number": "god",
    "email": GOD_EMAIL,
    "name": GOD_NAME,
    "pwd": GOD_PWD,
    "meun_crud": [
        { menu_id: "settingno0101", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "settingno0102", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "settingno0103", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "settingno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "memberno01", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "memberno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "memberno0301", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "rootno01", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        {menu_id:"rootno02","create":true,"read":true,"update":true,"delete":true,"disable":false},
    ]
}];


var funDataRoot = [
    { _id: "rootno01", parent_id: null, name: "系統設定", url: "http://localhost/setting", system_parameter: 0 },
    { _id: "rootno02", parent_id: null, name: "會員管理", url: "http://localhost/system", system_parameter: 0 }
]

var funDataR2 = [
    { _id: "settingno01", parent_id: "rootno01", name: "System Setting1", url: "http://localhost/setting", system_parameter: 0 },
    { _id: "settingno02", parent_id: "rootno01", name: "System Setting2", url: "http://localhost/setting", system_parameter: 0 },
    { _id: "memberno01", parent_id: "rootno02", name: "Member1", url: "http://localhost/setting", system_parameter: 0 },
    { _id: "memberno02", parent_id: "rootno02", name: "Member2", url: "http://localhost/setting", system_parameter: 0 },
    { _id: "memberno03", parent_id: "rootno02", name: "Member3", url: "http://localhost/setting", system_parameter: 0 }
]

var funDataR3 = [
    { _id: "settingno0101", parent_id: "settingno01", name: "role setting", url: "http://localhost/setting role", system_parameter: 0 },
    { _id: "settingno0102", parent_id: "settingno01", name: "function setting", url: "http://localhost/setting function", system_parameter: 0 },
    { _id: "settingno0103", parent_id: "settingno01", name: "permission setting", url: "http://localhost/setting persission", system_parameter: 0 },
    { _id: "memberno0301", parent_id: "memberno03", name: "member happy hour", url: "http://localhost/happyhour", system_parameter: 0 },
]

var godSearch = new User({
    system_parameter: GOD_SYS,
    email: GOD_EMAIL,
    pwd: GOD_PWD
});


userService.getUser(godSearch, function(data) {

    if (response.codeEnum.OK != data.code) {
        Role.collection.insertMany(roleData, function(err, r) {
            Menu.collection.insertMany(funDataRoot, function(errf1, f1_data) {
                // body...
            });
            Menu.collection.insertMany(funDataR2, function(errf2, f2_data) {
                // body...
            });
            Menu.collection.insertMany(funDataR3, function(errf3, f3_data) {
                // body...
            });

            User.collection.insertMany(god, function(m_err, user_data) {


                user_data.insertedIds.forEach(function(argument) {
                    // console.log("role==step1=>"+argument);

                    User.findById(argument, function(err, user) {
                        if (null != user) {
                            user.role = r.insertedIds[0];

                            user.save(function(argument) {
                                if (err) throw err;
                                console.log('God create!');
                            });
                        }
                    });
                });
            });
        });

        Role.collection.insertMany(adminRoleData, function(err, r) {

        });

        Role.collection.insertMany(userRoleData, function(err, r) {

        });
    }

});



// for(var i=0;i<funDataRoot.length;i++){
//  console.log("0==>"+funDataRoot[i].temp_id);
//  for(var j=0;j<funDataR2.length;j++){
//      // console.log("..."+funDataR2[j].temp_id.lastIndexOf("_"+i));
//      // console.log(".._"+j);
//      if("_"+funDataR2[j].temp_id.lastIndexOf("_"+i) == "_"+j){
//          console.log(funDataR2[j].temp_id);
//      }
//  }
// }
