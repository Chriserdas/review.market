require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cron = require('cron');
const { User, Product, Category, Supermarket, Offer } = require("./models/Schemas");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const supermarketRoutes = require('./routes/supermarket');
const productRoutes = require('./routes/product');
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
app.use('/api/offer', offerRoutes);


//insert product
app.get('/products', async(req, res) => {
   const createdProduct = await Product.insertMany(products.products);
   res.send({ createdProduct });
});

//insert categories,subcategories
app.get('/categories', async(req, res) => {
   const createdCategory= await Category.insertMany(categories.categories);
   res.send(createdCategory);
});

//insert users
app.get('/user', async(req, res) => {
    await User.remove({})
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
    //{ $project: {"offer.likes":1, "offer.stock":1, "offer.dislikes":1, "offer.price":1,"offer._id":1, "products._id":1, "products.name":1,"products.price":1 , "products.image":1,"supermarkets.properties.name":1, "supermarkets.geometry.coordinates":1,"user.username":1, "user._id":1 } }
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
    {$project: {"properties.name":1, "properties.shop":1, "geometry.coordinates":1 } }
   ]).then((result)=>{
        res.send(result);
   })
});

//get categories,subcategories,products
/*
app.get('/api/productInfo', async(req,res) => {
    Category.aggregate([
        {
        $lookup:
            {
            from: "products",
            localField: "subcategories.uuid",
            foreignField: "subcategory",
            as: "products"
            }
        },
        { $project: {"name":1, "subcategories.name":1, "products.name":1}}

    ]).then((result)=>{
        res.send(result);
    })
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
  
    { $project: {"_id":1, "username":1 , "totalScore":1, "score":1 ,"token":1, "offerLiked._id":1, "offerDisliked._id":1, "uploadedOffers._id":1} }
   ]).then((result)=>{
        res.send(result);
   })
});


//tokens
const userTokens = async () => {
    User.find({}, (err, users) => {
        if(err) {
          res.status(500).send(err);
        } else {
           let firstDay = new Date();
           if(firstDay.getDate() === 1) {
            //for each user give 100 tokens
            users.forEach((user) => {
                if(!user.isAdmin){
                    user.token += 100;
                    user.save();
                }
            });
           }
           let date = new Date();
           let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
              if(date.getDate() === lastDay.getDate()) {
                if(!users.isAdmin){
                    let totalTokens = 0; //users.length*100
                    let totalscore = 0; //the sum of all users score
                    let tokens = 0; //tokens are the 80% of totalTokens
                    User.find({}, (err, documents) => {
                        if (err) throw err;
                        documents.forEach((doc) => {
                            if(!doc.isAdmin){
                                totalTokens += 100 
                                totalscore += doc.score;
                            }
                          });
                        documents.forEach((user) => {
                        let userScore = user.score //the score of each user
                        let tokens = totalTokens * 0.8;
                        user.token += (tokens * userScore) / totalscore;
                        user.token = Math.round(user.token);
                        user.save();
                        });
                    });
                }
                }
          }
      })
  }

// Schedule task to run every 24hours
const job3 = new cron.CronJob('* */24 * * *', userTokens, null, true);
job3.start();




app.get("/", (req, res) => {
    res.send("Server is ready");
});


const port = 5000;

app.listen(5000, () => {
    console.log(`Server running at http://localhost:${port}`);
});

