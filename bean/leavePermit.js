var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var leavePermit = new Schema({
    _id: "String",
    bundle_id:"String",//同批請假ID
	system_parameter:{ type: Number, min: 0, max: 999 },
    permit_user_id:String,//允許的使用者
    permit_rank:String,//允許的層級
    permit_id:String,//允許的ID
    permit_name:String,//允許的NAME
    permit_apply_day:Date,//簽允許的時間
}, { timestamps: { permitApplyDay: 'permit_apply_day' } });
var bean_function = mongoose.model('leave_permit', leavePermit, 'leave_permit');

module.exports = bean_function;
