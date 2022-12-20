const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String,required:[true,'Please provide username'],minlength:4,maxlength:25},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:[true,'Please provide password']},
    isAdmin:{type:Boolean,default:false,require:true},
    entryDate:{type:Date,default:Date()},
    token:{type:Number, default:0}
});

const productSchema = new mongoose.Schema(
{
    "products" :[{
      id: {type:Number},
      name: { type: String, required: true},
      category: { type: String, required: true },
      subcategory: {type: String, required: true}

    },
],
    "categories" :[{
      id: {type:Number},
      name: { type: String, required: true},
      subcategory: [{
        name: { type: String, required: true},
        uuid: {type:Number, required: true},
      }]
    }]
}
  );


const User = mongoose.model("users", userSchema);
const Product = mongoose.model("product", productSchema);

module.exports = { User, Product};