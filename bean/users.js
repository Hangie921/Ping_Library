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
    menu_crud: Array,
    company_id:String,
    group_id:String,
    available_date:String, 
    custom: Schema.Types.Mixed
});

userSchema.methods.say = function() {
    // add some stuff to the users name
    return this.name + '-dude';
};

// userSchema.methods.getRefs = function(callback) {
//     // add some stuff to the users name
//     return this.model('company').findById(this.custom._company, function(err, data) {
//         callback(data);
//     });
// };

// { collectionName: custom.key}
// { company: "_company"}
userSchema.methods.getRefs = function(conditions, callback) {
    var user = this;
    if (Object.keys(conditions).length === 0 ) {
        return callback({});
    }
    var collectionName = Object.keys(conditions)[0];
    var customKey = conditions[collectionName];

    // @Todo(20160415): 目前只有join一張table，之後要join多張
    return this.model(collectionName).findById(this.custom[customKey], function(err, data) {
        if (err) console.log(err);
        user.custom[customKey] = data;
        callback(user);
    });
};

userSchema.index({ system_parameter: 1, email: 1 }, { unique: true });

// // the schema is useless so far
// // we need to create a model using it
var bean_users = mongoose.model('user', userSchema);

// // make this available to our users in our Node applications
module.exports = bean_users;
