var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var groupSchema = new Schema({
	_id:"String",
	system_parameter:{ type: Number, min: 0, max: 999 },
	name:String,
	parent_id:String,
	rank:Number,
	group:Array
})

var bean_group = mongoose.model('group', groupSchema);

module.exports = bean_group;