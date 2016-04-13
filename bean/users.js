// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var userSchema = new Schema({
    system_parameter: { type: Number, min: 0, max: 999, require: [true, "need system_parameter"] },
    id_number: String,
    email: { type: String, require: true },
    name: String,
    pwd: { type: String, require: true },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
    function_crud: Array,
    custom: Schema.Types.Mixed
});

userSchema.methods.say = function() {
    // add some stuff to the users name
    return this.name + '-dude';
};


userSchema.index({ system_parameter: 1, email: 1 }, { unique: true });

// // the schema is useless so far
// // we need to create a model using it
var bean_users = mongoose.model('user', userSchema);

// // make this available to our users in our Node applications
module.exports = bean_users;
