var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var companySchema = new Schema({
	_id:"String",
	system_parameter:{ type: Number, min: 0, max: 999 },
	name:String,
	address:String,
	phone1:String,
	phone2:String,
    fax:String,
    url:String,
    id_number:String,
    custom: Schema.Types.Mixed
}).index({ system_parameter: 1 }, { unique: true });
var bean_function = mongoose.model('company', companySchema,'company');

module.exports = bean_function;