var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var menuSchema = new Schema({
	_id:"String",
	system_parameter:{ type: Number, min: 0, max: 999 },
	name:String,
	parent_id:String,
	menu:Array,
    menu_crud:Array
})

var bean_menu = mongoose.model('menu', menuSchema,'menu');

module.exports = bean_menu;