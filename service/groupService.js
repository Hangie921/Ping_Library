//--DEFINE---
var Group = require('../bean/group');
var response = require('../common/response.js');
var mongoose = require('mongoose');

var hashGroup = null;
//--PUBLIC FUNCTION---
var fun_setGroup = function(groupobj, callback) {
    groupobj.save(function(err, group) {
        if (err) throw err;
        var rtn = response.OK;
        rtn.values = group;
        callback(rtn);
    });
}

var fun_getGroup = function(system_parameter, callback) {
    Group.find({
        system_parameter: system_parameter
    }, function(err, data) {
        if (err) throw err;
        hashGroup = data;
        var groupRootAry = [];
        for (var key in data) {
            if (data[key].parent_id == null || data[key].parent_id == "null" || data[key].parent_id.trim() == "") {
                data[key].rank = 0;
                //第一層 儲存rank
                Group.findByIdAndUpdate(data[key]._id, data[key], { new: true }, function(err, data) {});

                groupRootAry.push(data[key]);
                getGroupByParentId(data[key]);
            }
        }
        callback(groupRootAry);
    });
}
var fun_getGroupList = function(system_parameter, callback) {
    Group.find({
        system_parameter: system_parameter
    }, function(err, data) {
        if (err) throw err;
        //為jOrgChart套件而增加 將null變更為=>""
        for (var key in data) {
            if (data[key].parent_id == null || data[key].parent_id == "null" || data[key].parent_id.trim() == "") {
                data[key].parent_id = "";
            }
        }
        callback(data);
    });
}

var fun_setGroupById = function(groupobj, callback) {
    Group.findByIdAndUpdate(groupobj._id, groupobj, { new: true }, function(err, data) {
        if (err) throw err;
        var rtn = response.OK;
        rtn.values = data;
        callback(rtn);
    });
}

//--Private Method

/**
 * 向下搜尋物件
 **/
function getGroupByParentId(obj) {
    var fhg = null;
    //找出該層是否還有下層，有下層 則向下取物
    if (fhg = findHashGroup_id(obj._id, obj)) {
        //物件存在 向下取件
        for (var key in fhg) {
            getGroupByParentId(fhg[key]);
        }
    }
}

/**
 * 由hashGroup取出下層物件 在 將物件塞入子節點
 * _id 物件
 * obj 為上層物件
 **/
function findHashGroup_id(_id, obj) {
    var rtnAry = new Array();
    for (var key in hashGroup) {
        if (hashGroup[key].parent_id == _id) {
            //將物件塞入此目錄下的子節點
            hashGroup[key].rank = obj.rank + 1;
            //第二層之後 儲存rank
            Group.findByIdAndUpdate(hashGroup[key]._id, hashGroup[key], { new: true }, function(err, data) {});
            obj.group.push(hashGroup[key]);
            rtnAry.push(hashGroup[key]);
        }
    }
    return rtnAry.length > 0 ? rtnAry : null;
}

exports.setGroup = fun_setGroup;
exports.getGroup = fun_getGroup;
exports.getGroupList = fun_getGroupList;
exports.setGroupById = fun_setGroupById;
