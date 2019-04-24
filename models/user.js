const      
    mongoose                = require("mongoose")
,   passport                = require("passport")
,   passportLocalMongoose   = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    user: String, 
    password: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);