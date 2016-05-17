var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var leavePermit = new Schema({
        _id: "String",
        bundle_id: "String", //同批請假ID
        system_parameter: { type: Number, min: 0, max: 999 },
        leave_user_id: String, //請假人
        leave_year: String, //請假年度
        leave_start_date: String, //請假起始時間
        leave_start_time: String, //請假起始時間
        leave_end_date: String, //請假結束時間
        leave_end_time: String, //請假結束時間
        leave_total_hour: String, //請假總時間(分鐘)
        leave_group_id: String, //請假人的群組層
        leave_type: String, //請假理由
        permit_user_id: String, //允許的使用者
        permit_rank: String, //允許的層級
        permit_group_id: String, //需要允許的群組層
        permit_id: String, //允許的ID
        permit_name: String, //允許的NAME
        permit_apply_day: String, //簽允許的時間
    }
    // ,{ timestamps: { permitApplyDay: 'permit_apply_day' } }
);
var bean_function = mongoose.model('leave_permit', leavePermit, 'leave_permit');

module.exports = bean_function;
