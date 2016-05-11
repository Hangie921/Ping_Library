var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var leaveRoleByLevel = new Schema({
    _id: "String",
    system_parameter: { type: Number, min: 0, max: 999 },//空值為樣板 新增公司時候複製一份出來
    leave_type_id: String,//請假原因
    level: Number,//年資(月)
    use_days: Number//可使用的天數(分鐘)
})
var bean_function = mongoose.model('leave_role_by_level', leaveRoleByLevel, 'leave_role_by_level');

module.exports = bean_function;
