require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
let schedule = require('node-schedule');
const { User, Product, Category, Supermarket, Offer } = require("./models/Schemas");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const supermarketRoutes = require('./routes/supermarket');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const offerRoutes = require('./routes/offer');

const users = require("./data/users");
const products = require('./data/products.js');
const categories = require('./data/categories.js');
const supermarket = require("./data/supermarket.js");
const offer = require("./data/offer");



//connect to database
const url = "mongodb://127.0.0.1:27017/reviewMarket";
async function connect(){
    try{
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log("Connected to MongoDB");

    }catch(error){
        console.error(error)
    }
}
connect();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/supermarket', supermarketRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/offer', offerRoutes);


//insert product
app.get('/products', async(req, res) => {
   const createdProduct = await Product.insertMany(products.products);
   res.send({ createdProduct });
});

//insert categories,subcategories
app.get('/categories', async(req, res) => {
   const createdCategory= await Category.insertMany(categories.categories);
   res.send({ createdCategory });
});

//insert users
app.get('/user', async(req, res) => {
    const createdUsers = await User.insertMany(users);
    res.send({ createdUsers });
  });

//insert supermarket
app.get('/supermarket', async(req, res) => {
  const createdSupermarket = await Supermarket.insertMany(supermarket.features);
  res.send({ createdSupermarket });
});

//insert offer
app.get('/offer', async(req,res) => {
  await Offer.remove({})
  const createOffer = await Offer.insertMany(offer);
  res.send(createOffer);
});

//supermarkets and products with offers
app.get('/api/getCurrentLocation', async(req,res) => {
  Offer.aggregate([
    {
        $lookup:{
            from:"supermarkets",
            localField:"supermarkets",
            foreignField:"_id",
            as:"supermarkets"
        }
    },
    {
        $lookup:{
            from:"products",
            localField:"products",
            foreignField:"_id",
            as:"products"
        }
    },
    {
      $lookup:{
          from:"users",
          localField:"createdBy",
          foreignField:"_id",
          as:"user"
      }
    },
    { $project: {"offer.likes":1, "offer.stock":1, "offer.dislikes":1, "offer.price":1,"offer._id":1, "products._id":1, "products.name":1,"products.price":1 , "products.image":1,"supermarkets.properties.name":1, "supermarkets.geometry.coordinates":1,"user.username":1, "user._id":1 } }
   ]).then((result)=>{
        res.send(result);
   })
});

//supermarket without offers
app.get('/api/getSupermarket', async(req,res) => {
  Supermarket.aggregate([
    {
      $lookup: {
          from: "offers",
          localField: "_id",
          foreignField: "supermarkets",
          as: "supermarkets"
      }
    },
    {
      $match: {
          $expr: {
              $eq: [ { "$size": "$supermarkets" }, 0 ]
          }
      }
    },
    { $project: {"properties.name":1, "geometry.coordinates":1 } }
   ]).then((result)=>{
        res.send(result);
   })
});
//products with offers
app.get('/api/getProductOffer', async(req,res) => {
  Offer.aggregate([
    {
        $lookup:{
            from:"products",
            localField:"products",
            foreignField:"_id",
            as:"products"
        }
    },
    { $project: {"offer._id":1, "products.name":1} }
   ]).then((result)=>{
        res.send(result);
   })
});


//get categories,subcategories,products
app.get('/api/productCategory', async(req,res) => {
  Product.aggregate([
    {
       $lookup:
          {
            from: "categories",
            let: { category: "$category", subcategory: "$subcategory" },
            pipeline: [
               {
                 $unwind: "$categories.subcategories"
               },
               {
                 $match: {
                     $expr: {
                         $and: [
                             { $eq: [ "$id",  "$$category" ] },
                             { $eq: [ "$subcategories.uuid", "$$subcategory" ] }
                         ]
                     }
                 }
               }
            ],
            as: "moreInfo"
          }
    }
 ]).then((result)=>{
  res.send(result);
})
});

//tokens
app.post('/tokens', (req, res) => {
  //Find all users in the database
  User.find({}, (err, users) => {
    if(err) {
      res.status(500).send(err);
    } else {
       let firstDay = new Date();
       if(firstDay.getDate() === 1) {
        //For each user, create a fixed number of tokens (100)
        users.forEach((user) => {
          user.token += 100;
          user.save();
        });
       }
       let date = new Date();
       let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          if(date.getDate() === lastDay.getDate()) {
            //Calculate the total number of tokens to be distributed
            let totalTokens = users.length * 100 * 0.8;
            //Calculate the proportion of tokens to be distributed to each user based on their evaluation score
            users.forEach((user) => {
              let proportion = user.evaluationScore / totalEvaluationScore;
              user.token += totalTokens * proportion;
              user.token = Math.round(user.token);
              user.save();
            });
            res.status(200).send("Tokens distributed successfully");
          }
      }
  })
});

//let job = schedule.scheduleJob('* */24 * * *', function(){
 /* axios.post('/tokens').then(() => {
    console.log('Token distributed successfully')
  }).catch((err) => {
    console.log(err);
  });
});*/

//for user history of likes,dislikes,offers
app.get('/api/history', async(req,res) => {
  User.aggregate([
    {
        $lookup:{
            from:"offers",
            localField:"_id",
            foreignField:"likes",
            as:"offerLiked"
        }
    },
    {
      $lookup:{
          from:"offers",
          localField:"_id",
          foreignField:"dislikes",
          as:"offerDisliked"
      }
    },
    {
      $lookup:{
          from:"offers",
          localField:"_id",
          foreignField:"createdBy",
          as:"uploadedOffers"
      }
    },
  
    { $project: {"_id":1, "username":1 ,"offerLiked._id":1, "offerDisliked._id":1, "uploadedOffers._id":1} }
   ]).then((result)=>{
        res.send(result);
   })
});

app.get("/", (req, res) => {
    res.send("Server is ready");
});


const port = 5000;

app.listen(5000, () => {
    console.log(`Server running at http://localhost:${port}`);
});

