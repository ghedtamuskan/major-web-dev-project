// 22 Authentication
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new Schema ({
    email:{                         //username and password added by default using passport function
type : String,
required:true
    }
})

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema);
module.exports = User;