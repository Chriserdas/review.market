const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String,required:[true,'Please provide username'],minlength:4,maxlength:25},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:[true,'Please provide password']},
    isAdmin:{type:Boolean,default:false,require:true},
    entryDate:{type:Date,default:Date()},
    token:{type:Number, default:0},
    /*likedOffers:[
        {type: mongoose.Schema.Types.ObjectId}
    ],
    dislikedOffers:[
        {type: mongoose.Schema.Types.ObjectId}
    ]*/
});


const productSchema = new mongoose.Schema({
                        id:Number,
                        name:String,
                        price:Number,
                        image:String,
                        category:String,
                        subcategory:String
});

const categorySchema = new mongoose.Schema({
                        id:String,
                        name:String,
                        subcategories:[
                                {
                                        name:String,
                                        uuid:String
                                },
                        ]
});


const SupermarketSchema = new mongoose.Schema({
        type:{
                type:String
        },
        properties:{
                "@id":String,
                "brand":String,
                "brand:wikidata":String,
                "brand:wikipedia":String,
                "name":String,
                "opening_hours":String,
                "shop":String
        },
        geometry:{
                "type":{
                    type:String
                },
                "coordinates":[mongoose.Schema.Types.Mixed]
        },
        id:String
});

const OfferSchema = new mongoose.Schema({
                products:{type: mongoose.Schema.Types.ObjectId},
                supermarkets:{type: mongoose.Schema.Types.ObjectId},
                criteria:{type: Boolean},
                price:{type:Number, default:0,required:true},
                createdBy:{type:mongoose.Schema.Types.ObjectId},
                likes: [
                    {type: mongoose.Schema.Types.ObjectId}
                ],
                createDate: {type: Date,default: new Date()},
                dislikes: [
                    {type: mongoose.Schema.Types.ObjectId}
                ],
                stock: {type: Boolean}
});

const User = mongoose.model("users", userSchema);
const Product = mongoose.model("products", productSchema);
const Category = mongoose.model("categories", categorySchema);
const Supermarket = mongoose.model("supermarkets", SupermarketSchema);
const Offer = mongoose.model("offers", OfferSchema);

module.exports= {User, Product, Category, Supermarket, Offer}