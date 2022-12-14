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
        validate:{
            validator:validator.isEmail,
            message:'Please provide a valid email adress'
        },
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6,
        select:false
    },
});


const User = mongoose.model("user", userSchema);

module.exports = { User };