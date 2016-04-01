// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var roleobj = require('.role');


// create a schema
var userSchema = new Schema({
	system_parameter:{ type: Number, min: 0, max: 999 },
	id_number:String,
	email:String,
	name:String,
	pwd:String,
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
	//demo-----
    // id: Schema.Types.ObjectId,
    // firstName: String,
    // lastName: String,
    // fullName: { type: String, trim: true },
    // managerId: { type: Number, min: 18, max: 65 },
    // managerName: String,
    // title: String,
    // department: String,
    // cellPhone:String,
    // officePhone:String,
    // email:String,
    // city:String,
    // pic:String,
    // twitterId:String,
    // blog:String
});

// userSchema.methods.dudify = function() {
//   // add some stuff to the users name
//   this.name = this.name + '-dude'; 
//   return this.name;
// };

// // the schema is useless so far
// // we need to create a model using it
var bean_users = mongoose.model('users', userSchema);

// // make this available to our users in our Node applications
module.exports = bean_users;