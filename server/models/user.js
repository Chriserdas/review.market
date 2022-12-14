const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

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
    }
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };