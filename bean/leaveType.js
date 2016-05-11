var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var leaveType = new Schema({
    _id: "String",
    name:String,//休假原因(病假,特休....等)
    descript:String//其他休假可使用
})
var bean_function = mongoose.model('leave_type', leaveType, 'leave_type');

module.exports = bean_function;
