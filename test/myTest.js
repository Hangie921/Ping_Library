var express = require('express');
var usersobj = require('../bean/users');
var functionobj = require('../bean/function');
var roleobj = require('../bean/roles');
var leaveRoleByLevel = require('../bean/leaveRoleByLevel');
var leaveRoleBySchedule = require('../bean/leaveRoleBySchedule');
var leaveType = require('../bean/leaveType');
var leavePermit = require('../bean/leavePermit');
var session = require('express-session');

var funService = require('../service/functionService');
var roleService = require('../service/roleService');
var userService = require('../service/userService');
var companyService = require('../service/companyService');


var sessionManager = require('../interface/session');
var gengod = require('../common/generate/god');

var pinglib = require('../index.js');
var groupService = pinglib.GroupService;
var Group = pinglib.Group;
var Company = pinglib.Company;


var UserService = pinglib.UserService;


var clone = require('../common/clone');

// var serviceConfig = require('../example/server')
// var config = serviceConfig.config();
// logger.debug("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
// logger.debug("test env..."+config.port);
var app = express();

//-------mongodb setup  start ---------------
// var mongoose = require("mongoose");
//set PORT = 3000,set IP = 192.168.60.56,set DBNAME = test
// mongoose.connect("mongodb://"+process.env.IP+":"+process.env.PORT+"/"+process.env.DBNAME);
// mongoose.connect("mongodb://192.168.60.65:3000/test");
// var mongoose = require("../common/mongoose");

//-------mongodb setup  end ---------------

// var assert = require('assert');
// var Schema = mongoose.Schema;



//http://localhost:3000/employees2?name=j
//http://localhost:3000/employees

//http://localhost:3000/employees/1

//http://localhost:3000/employees/1/reports


//remeber npm install --save body-parser
//http://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters-in-express


//------configure start------------------------

// app.configure(function(){
//   app.set('port', process.env.PORT || 3000);
//   app.set('views', __dirname + '/views');
//   app.set('view engine', 'jade');
//   app.use(express.favicon());
//   app.use(express.logger('dev'));
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(express.static(path.join(__dirname, 'public')));
// });

// app.configure('development', function() {
//   console.log('Using development settings.');
//   app.set('connection', mysql.createConnection({
//     host: '',
//     user: '',
//     port: '',
//     password: ''}));
//   app.use(express.errorHandler());
// });

// app.configure('production', function() {
//   console.log('Using production settings.');
//   app.set('connection', mysql.createConnection({
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT}));
// });

//------configure end--------------------------



var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// app.use(express.multipart());

app.post('/test-page', function(req, res) {
    console.log(req);
});



//攔截錯誤
process.on('uncaughtException', function(err) {
    console.info(err);
    console.error('Error caught in uncaughtException event:', err);
    sessionManager.cleanSession(function(data) {});
});

//mytest
// var test = wines2.sys_findMember('1234');

//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications


// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
// mbs001.dudify(function(err, name) {
//   if (err) throw err;
//   console.log('Your new name is ' + name);
// });

//--save
// mbs001.save(function(err) {
//   if (err) throw err;
//   console.log('User saved successfully!');
//});

//--get all the users
//findAll
// memberobj.find({}, function(err, members) {
//   if (err) throw err;
//   // object of all the users
//   console.log(members);
// });

//findOne
// get the user starlord55
// memberobj.find({ firstName: 'Amy' }, function(err, member) {
//   if (err) throw err;
//   // object of the user
//   console.log("findOne="+member);
// });

var god = new usersobj({
    system_parameter: 0,
    email: 'god@ping.com.sg',
    pwd: '!QAZ@WSX'
});

var usrSearch = new usersobj({
    system_parameter: 0,
    email: 'mbs002@ping.com.sg',
    pwd: 'ACDE',
    menu_crud: [
        { menu_id: "settingno0101", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "settingno0102", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "settingno0103", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "settingno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "memberno01", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "memberno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "memberno0301", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "rootno01", "create": true, "read": true, "update": true, "delete": true, "disable": false },
        { menu_id: "rootno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    ]
});

var function_crud = [
    { menu_id: "settingno0101", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "settingno0102", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "settingno0103", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "settingno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "memberno01", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "memberno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "memberno0301", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "rootno01", "create": true, "read": true, "update": true, "delete": true, "disable": false },
    { menu_id: "rootno02", "create": true, "read": true, "update": true, "delete": true, "disable": false },
]

//呼叫API
// sessionManager.getUser(usrSearch, function (data) {
//  console.log("usrSearch is "+data);
// });

var roleSearch = new roleobj({
    system_parameter: 0,
    email: 'mbs001@ping.com.sg',
    pwd: 'ABCDEFG'
});

var userReg = new usersobj({
    system_parameter: 0,
    email: 'mbs010@ping.com.sg',
    pwd: 'AAA'
});

var funObj = new functionobj({
    system_parameter: 0,
    // parent_id : null
});

var userNo1 = new usersobj({
    system_parameter: 0,
    email: 'mbs001@ping.com.sg',
    pwd: 'AAA'
});
// roleService.getRoleBySys(0, function (data) {
//   console.log("roleBySys="+data.values);
// });

// sessionManager.getRoleFunByUser(userReg, function (data) {
//   console.log("getRoleFunByUser="+data.values);
// });

// sessionManager.registered(userReg,function (data) {
//  console.log("registered====>"+data.values);
// });

//將USER 輸入function_crud
// sessionManager.getUser(userReg, function (usrObj) {
//   console.log("getUser... "+usrObj.values);
//   sessionManager.setMenuCrud(usrObj,function_crud,function (data) {
//     console.log("setFunction... "+data.values);

//   });
// });

// var role_id_ary = ['570746898af057fc456b2fc7','570746898af057fc456b2fc8'];
var role_id_ary = ['5719fcc5d98ed82035021741'];
// // //將USER 輸入Role
// sessionManager.getUser(userReg, function (usrObj) {
//   // console.log("getUser... "+usrObj.values);
//   var temp_userObj = clone(usrObj);
//   sessionManager.setUserRole(temp_userObj,role_id_ary,function (data) {
//     // console.log("setUserRole... "+data.values);

//   });
// });



// sessionManager.login(usrSearch,function (data) {
//   console.log(data);
// });

// sessionManager.forgot(usrSearch,function (data) {
//  console.log("forgot====>"+data.values);
// });

// sessionManager.throwError(function (data) {

// });



// sessionManager.registered(userReg,function (data) {
//    console.log(data);
// });

//取得使用者資訊  包括menu_crud
// sessionManager.getUser(userReg, function (data) {
//  console.log("usrSearch is "+data.values);
// });


//取得UserFunction
// sessionManager.getMenuByUser(userReg, function (data) {
//   console.log(data.values);

//   //   // //--根目錄
//     for(var key in data.values){
//       if(data.values[key].parent_id == null){
//         // console.log(data[key].function.toString());
//         console.log(data.values[key].toString());
//         console.log("-----------------------------------------");
//       }
//     }
// });

//--第二層印製
// sessionManager.getMenu(funObj,function (data) {
//   // console.log(data);

// //   // //--根目錄
//   for(var key in data.values){
//     if(data.values[key].parent_id == null){
//       // console.log(data[key].function.toString());
//       console.log(data.values[key].toString());
//       console.log("-----------------------------------------");
//     }
//   }

// //   // console.log("function success...");

// });



// var response = require('../common/response');
// console.log(response.obj(response.codeEnum.OK,'hahahah'));

//logger test
// logger.info("logger info...");
// logger.debug("logger debug...");


// userService.registered(usrSearch,function (argument) {
//   // body...
//   logger.debug("argument.values="+argument.values);
// });








//產生group 

function newGroup1() {
    var group = new Group();
    group._id = "hr1";
    group.system_parameter = 0;
    group.parent_id = null;
    group.name = "人力資源部";
    return group;
}

function newGroup1_1() {
    var group = new Group();
    group._id = "hr1_1";
    group.system_parameter = 0;
    group.parent_id = 'hr1';
    group.name = "會計組";
    return group;
}

function newGroup1_2() {
    var group = new Group();
    group._id = "hr1_2";
    group.system_parameter = 0;
    group.parent_id = 'hr1';
    group.name = "招募組";
    return group;
}

function newGroup2() {
    var group = new Group();
    group._id = "mis1";
    group.system_parameter = 0;
    group.parent_id = null;
    group.name = "MIS 部";
    return group;
}

function newGroup2_1() {
    var group = new Group();
    group._id = "mis1_1";
    group.system_parameter = 0;
    group.parent_id = 'mis1';
    group.name = "軟體工程組";
    return group;
}

function newGroup2_2() {
    var group = new Group();
    group._id = "mis1_2";
    group.system_parameter = 0;
    group.parent_id = 'mis1';
    group.name = "硬體工程組";
    return group;
}


// groupService.setGroup(newGroup1(), function(data1) {
//     groupService.setGroup(newGroup1_1(), function(data2) {
//         groupService.setGroup(newGroup1_2(), function(data3) {
//             groupService.setGroup(newGroup2(), function(data4) {
//                 groupService.setGroup(newGroup2_1(), function(data5) {
//                     groupService.setGroup(newGroup2_2(), function(data6) {
//                       console.log('group create');
//                         callback();
//                     });
//                 });
//             });
//         });
//     });
// });


    function newCompany1() {
        var company = new Company();
        company._id="ping_team";
        company.system_parameter = 0;
        company.id_number = "55667788"
        company.name = 'Ping製作團隊';
        company.address = '新北市鬧區';
        company.url = 'http://ping.com.tw';
        return company;
    }
    function newCompany2() {
        var company = new Company();
        company._id="ping_hr";
        company.system_parameter = 0;
        company.id_number = "1111111111"
        company.name = 'HR system';
        company.address = '新北市鬧區';
        company.url = 'http://hr.com.tw';
        return company;
    }

    // companyService.setCompany(newCompany1(),function (argument) {
    //   console.log("company1 _id=>"+argument.values);
    //   callback();
    // });
    // companyService.setCompany(newCompany2(),function (argument) {
    //   console.log("company2 _id=>"+argument.values);
    //   callback();
    // });


// //將USER 輸入company or group
sessionManager.getUser(userReg, function (usrObj) {
  var temp_userObj = clone(usrObj);

  temp_userObj.values[0].company_id = 'ping_hr';
  temp_userObj.values[0].group_id = 'mis1_1';
  //company group
  UserService.setUserById(temp_userObj.values[0],function (data) {
      console.log("data=>"+data.values);
  });
});
