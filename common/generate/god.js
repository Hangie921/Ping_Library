
//-------mongodb setup  start ---------------
var mongoose = require("mongoose");
mongoose.connect("mongodb://192.168.60.65/test");


var usersobj = require('../../bean/users');
var rolesobj = require('../../bean/roles');

var userService = require('../../service/userService');

// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', function() {
    console.log('connected', mongoose.connection.readyState);
});
db.once('disconnected', function() {
    console.log('disconnected', mongoose.connection.readyState);
});

var Schema = mongoose.Schema;

var GOD_EMAIL 	= "god@ping.com.sg";
var GOD_NAME  	= "上帝";
var GOD_PWD   	= "!QAZ@WSX";
var GOD_SYS		= 0;

var roleData = [
    {"system_parameter":0,"name":"GOD"}
];

var god = [
        {"system_parameter":GOD_SYS,"id_number":"god","email":GOD_EMAIL,"name":GOD_NAME,"pwd":GOD_PWD}
    ];

var funDataRoot = [
	{parent_id:null,name:"系統設定",url:"http://localhost/setting",temp_id:"0"},
	{parent_id:null,name:"會員管理",url:"http://localhost/system",temp_id:"1"}
]

var funDataR2	= [
	{parent_id:null,name:"System Setting1",url:"http://localhost/setting",temp_id:"1_0"},
	{parent_id:null,name:"System Setting2",url:"http://localhost/setting",temp_id:"2_0"},
	{parent_id:null,name:"Member1",url:"http://localhost/setting",temp_id:"1_1"},
	{parent_id:null,name:"Member2",url:"http://localhost/setting",temp_id:"2_1"},
	{parent_id:null,name:"Member3",url:"http://localhost/setting",temp_id:"3_1"}
]

var funDataR3	= [
	{parent_id:null,name:"Member2_1",url:"http://localhost/setting",temp_id:"1_2_1"}
]

var godSearch = new usersobj({
  system_parameter: GOD_SYS,
  email: GOD_EMAIL,
  pwd:GOD_PWD 
});


userService.getUser(godSearch,function (err,data) {
	if(data == ""){
		rolesobj.collection.insertMany(roleData, function(err,r) {
			
			 usersobj.collection.insertMany(god, function(m_err,user_data) {


				user_data.insertedIds.forEach(function(argument) {
		            console.log("role==step1=>"+argument);

		            usersobj.findById(argument, function(err, user) {
		                if(null != user){
		                  user.role = r.insertedIds[0];

		                  user.save(function (argument) {
		                    if (err) throw err;
		                    console.log('God create!');
		                  });
		                }
		            });
		        });
			 });
		});
	}
});



// for(var i=0;i<funDataRoot.length;i++){
// 	console.log("0==>"+funDataRoot[i].temp_id);
// 	for(var j=0;j<funDataR2.length;j++){
// 		// console.log("..."+funDataR2[j].temp_id.lastIndexOf("_"+i));
// 		// console.log(".._"+j);
// 		if("_"+funDataR2[j].temp_id.lastIndexOf("_"+i) == "_"+j){
// 			console.log(funDataR2[j].temp_id);
// 		}
// 	}
// }
