const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String,required:[true,'Please provide username'],minlength:4,maxlength:25},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:[true,'Please provide password']},
    isAdmin:{type:Boolean,default:false,require:true},
    entryDate:{type:Date,default:Date()},
    token:{type:Number, default:0}
});


const ProdCategSchema = new mongoose.Schema({
        products:[
                {
                        id:Number,
                        name:String,
                        price:Number,
                        image:String,
                        category:String,
                        subcategory:String
                },
        ],
        categories:[
                {
                        id:String,
                        name:String,
                        subcategories:[
                                {
                                        name:String,
                                        uuid:String
                                },
                        ]
                }
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
                products:{type: String},
                supermarkets:{ type: String},
                price:{type:Number},
                criteria:Boolean,
                likeCount: {type: Number,default: 0},
                createdAt: {type: Date,default: new Date()},
                dislikeCount: {type: Number,default: 0},
                stock: {type: Number,default: 20}
});

const User = mongoose.model("users", userSchema);
const Data = mongoose.model("products_categories", ProdCategSchema);
const Supermarket = mongoose.model("supermarkets", SupermarketSchema);
const Offer = mongoose.model("offers", OfferSchema);

module.exports= {User, Data, Supermarket, Offer}