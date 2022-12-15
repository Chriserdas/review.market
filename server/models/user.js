const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username:{
        type:String,
        required:[true,'Please provide username'],
        minlength:4,
        maxlength:25,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6,
        select:false
    },
    isAdmin:{
        type:Boolean,
        default:false,
        require:true,
    },
});


const User = mongoose.model("user", userSchema);

module.exports = { User };