
//-------mongodb setup  start ---------------
var mongoose = require("mongoose");
mongoose.connect("mongodb://192.168.60.65/test");
// mongoose.connect("mongodb://"+process.env.IP+":"+process.env.PORT+"/"+process.env.DBNAME);

var usersobj = require('../bean/users');
var rolesobj = require('../bean/roles');

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
//-------mongodb setup  end ---------------

var assert = require('assert');
var Schema = mongoose.Schema;
//----USER INSERT START------------------------------
var UserSchema = new Schema({
    name : String,
    age : String
});

mongoose.model('Document', UserSchema);
var User = mongoose.model('Document');

var user = new User();

user.name = 'Jim';
user.age = '27';
user.save(function(err, user_Saved){
    if(err){
        throw err;
        console.log(err);
    }else{
        console.log('saved!');
    }
});
//----USER INSERT END------------------------------


//----MEMBER INSERT START------------------------------
var memberSchema = new Schema({
    _id: Schema.Types.ObjectId,
    system_parameter:{ type: Number, min: 0, max: 999 },
    id_number:String,
    email:String,
    name:String,
    pwd:String,
    role:Array
})
// var member = mongoose.model('users', memberSchema);

exports.findByManager = function(req, res) {
    var id = parseInt(req.params.id);
    console.log('findByManager2222: ' + id);
    db.collection('employees', function(err, collection) {
        collection.find({'managerId': id}).toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('members', function(err, collection) {
        if (name) {
            collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
                res.jsonp(items);
            });
        } else {
            collection.find().toArray(function(err, items) {
                res.jsonp(items);
            });
        }
    });
};

exports.sys_findMember = function(memberobj) {
    console.log('memberobj::'+memberobj);
    return memberobj+'hahaha';
};

var employees = [
        {"_id":"mbm001","system_parameter":0,"id_number":"mbs001","email":"mbs001@ping.com.sg","name":"Amy","pwd":"ABCDEFG","tteesstt":"tttttttttt","role":["role004"]},
        {"system_parameter":0,"id_number":"mbs002","email":"mbs002@ping.com.sg","name":"Peter","pwd":"ACDE","role":["role004"]},
        {"system_parameter":0,"id_number":"mbs003","email":"mbs003@ping.com.sg","name":"Walter","pwd":"EFEW","role":["role004"]},
        {"system_parameter":0,"id_number":"mbs004","email":"mbs004@ping.com.sg","name":"Randy","pwd":"BBC","role":["role004"]},
        {"system_parameter":0,"id_number":"mbs005","email":"mbs005@ping.com.sg","name":"RM","pwd":"CCCD","role":["role004"]},
        {"system_parameter":0,"id_number":"mbs006","email":"mbs006@ping.com.sg","name":"Janet","pwd":"AAAD","role":["role004"]}
    ];

// db.members.drop()
// usersobj.collection.insertMany(employees, function(err,r) {
//     assert.equal(null, err);
//     assert.equal(6, r.insertedCount);
//     // db.close();
// });


var roleSchema = new Schema({
    _id:String,
    system_parameter:{ type: Number, min: 0, max: 999 },
    name:String,
    function:Array
})

// var role = mongoose.model('roles', roleSchema);

var roleData = [
    {"system_parameter":0,"name":"GOD"},
    {"system_parameter":0,"name":"ADMIN"},
    {"system_parameter":0,"name":"USER"},
    {"system_parameter":0,"name":"DBA"},
    {"system_parameter":0,"name":"GUEST"}

]

/*
rolesobj.collection.insertMany(roleData, function(err,r) {
    // assert.equal(null, err);
    // assert.equal(5, r.insertedCount);

    // console.log(r);
    // console.log(r.insertedIds);
    // r.insertedIds.forEach(function (argument) {
    //     // body...
    //     console.log("aaaa="+argument);

    // });

    // employees[0].add ({"role":[r.insertedIds[0],r.insertedIds[1]]});
    // // employees[1].push (r.insertedIds[0]);
    // // employees[2].push (r.insertedIds[3]);

    // employees.forEach(function (argument) {
    //     // body...
    //     console.log(argument);
    // });

    usersobj.collection.insertMany(employees, function(m_err,m_r) {
        console.log(m_r);
        m_r.insertedIds.forEach(function(argument) {
            console.log("roke==="+r.insertedIds[0]);
            // body...
            usersobj.findById(argument, function(err, user) {
              // console.log(r.insertedIds[0]);
                if(null != user){
                  user.role = r.insertedIds[0];
                  console.log("user==>"+user);

                  user.save(function (argument) {
                    if (err) throw err;

                    console.log('User successfully updated!');
                    console.log(argument);
                  });
                }
            });
        });
    });
    // db.close();
});
