const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    password : {type:String},
    phone_number: {type:String, required:true},
});

module.exports = mongoose.model('User', UserSchema);