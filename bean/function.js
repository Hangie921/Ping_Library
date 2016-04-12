var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var functionSchema = new Schema({
	_id:"String",
	system_parameter:{ type: Number, min: 0, max: 999 },
	name:String,
	parent_id:String,
	function:{
        type: Array,
        ref: 'function'
    },
    // function_crud:Schema.Types.Mixed
    function_crud:Array
})

var bean_function = mongoose.model('function', functionSchema,'function');

module.exports = bean_function;