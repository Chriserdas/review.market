const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	  username:{type:String,required:[true,'Please provide username'],minlength:4,maxlength:25},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:[true,'Please provide password']},
    isAdmin:{type:Boolean,default:false,require:true},
    entryDate:{type:Date,default:Date()},
    token:{type:Number, default:0}
});

const ProductSchema = new mongoose.Schema(
  {
        id: {type:Number},
        name: { type: String, required: true},
        category: { type: String, required: true },
        subcategory: {type: String, required: true}
  
  });

const SubCategorySchema = new mongoose.Schema({
    name: { type: String, required: true},
    uuid: {type: String, required: true},
});

const CategorySchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: { type: String, required: true},
    subcategories: [SubCategorySchema],
});

const User = mongoose.model("users", userSchema);
const Product = mongoose.model("product", ProductSchema);
const Category = mongoose.model("category", CategorySchema);

module.exports = { User, Product, Category};