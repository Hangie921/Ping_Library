// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var roleSchema = new Schema({
	_id:Schema.Types.ObjectId,
	system_parameter:{ type: Number, min: 0, max: 999 },
	name:String,
	function:Array
})

var bean_role = mongoose.model('roles', roleSchema);

module.exports = bean_role;