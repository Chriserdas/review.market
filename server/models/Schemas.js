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
        features:[
                {
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
                },
        ]
});

const OfferSchema = new mongoose.Schema({
    
    offer:[
        {
            product:String,
            supermarket:String,
            price:Number,
            criteria:Boolean,
            createDate:{type:Date,default:Date()},
            likes:Number,
            dislikes:Number,
            stock:Boolean
        }      
    ],
});

const User = mongoose.model("users", userSchema);
const Data = mongoose.model("products_categories", ProdCategSchema);
const Supermarket = mongoose.model("supermarkets", SupermarketSchema);
const Offer = mongoose.model("offers", OfferSchema);

module.exports= {User, Data, Supermarket, Offer}