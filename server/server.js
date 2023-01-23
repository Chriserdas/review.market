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
const { use } = require("./routes/users");



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
app.post('/api/getOffers', async(req,res) => {
    const supermarket_id = req.body.supermarket_id;
    Offer.aggregate([
    {
        $match: {
            "supermarkets": mongoose.Types.ObjectId(supermarket_id)
        }
    },
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
    { $project: {"likes":1, "stock":1, "dislikes":1, "price":1, "_id":1,"createdDate":1, "createdBy":1,"products._id":1, "products.name":1, "products.image":1,"supermarkets.properties.name":1, "supermarkets.geometry.coordinates":1, "user._id":1,"user.username":1 } }
   ]).then((result)=>{
        res.send(result);
   })
});

app.get('/api/getCurrentLocation', async(req, res) => {
    Offer.aggregate([
        {
            "$lookup": {
                "from": "supermarkets",
                "localField": "supermarkets",
                "foreignField": "_id",
                "as": "supermarkets"
            }
        },
        {
            "$unwind": "$supermarkets"
        },
        {
            "$group": {
                "_id": "$supermarkets._id",
                "supermarkets": { "$first": "$supermarkets" }
            }
        },
        {
            "$replaceRoot": {
                "newRoot": "$supermarkets"
            }
        }
    ])
    .then(result => {
        res.json(result)
    });
    
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

app.post('/api/AccountData', async(req,res) => {
    let userId = req.body.userId
    User.find({"_id": userId,},{"username":1, "score":1, "token":1, "totalScore":1})
    .then(response=>{
        res.json(response)
    })
  });

//for user history of likes,dislikes,offers
app.post('/api/history', async(req,res) => {
    let userId = req.body.userId
    console.log(userId);
    Offer.aggregate([
        {
            $match: { "createdBy": userId }
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
                localField:"likes",
                foreignField:"userId",
                as:"userLikes"
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"dislikes",
                foreignField:"userId",
                as:"userDislikes"
            }
        },
        {$project: {"products.name":1, "products._id":1, "userLikes.username":1, "userDislikes.username":1 } }
    ]).then((result)=>{
        res.send(result);
    })
});

//tokens and reset score
const userTokens = async () => {
    User.find({}, (err, users) => {
        if(err) {
          res.status(500).send(err);
        } else {
           let firstDay = new Date();
           if(firstDay.getDate() === 1) {
            //for each user give 100 tokens
            users.forEach((user) => {
                    user.token += 100;
                    user.totalScore += user.score //keep track of totalScore
                    user.score = 0; //reset score
                    user.save();
            });
           }
           let date = new Date();
           let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
           if(date.getDate() === lastDay.getDate()) {
                let totalTokens = 0; //users.length*100
                let totalscore = 0; //the sum of all users score
                let tokens = 0; //tokens are the 80% of totalTokens
                users.forEach((user)=> {
                  totalTokens += 100;
                  totalscore+= user.score
                })
                users.forEach((user)=> {
                  let userScore = user.score
                  tokens = totalTokens * 0.8;
                  user.token += (tokens * userScore) / totalscore;
                  user.token = Math.round(user.token);
                  user.save();
                })
                //console.log(totalTokens)
                //console.log(totalscore)
                //console.log(tokens)
            }
      }
  })
}
// Schedule to run every 24hours
const job1 = new cron.CronJob('* */24 * * *', userTokens, null, true);
job1.start();


// delete offer after one week or renew for another week
const handleExpiredOffers = async () => {
  const currentDate = new Date();
  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(currentDate.getDate() - 7);

  // Retrieve all offers that were created one week ago or earlier
  const expiredOffers = await Offer.find({ createdDate: { $lte: oneWeekAgo } });

  //iterate over the expired offers
  expiredOffers.forEach(async offer => {
      //if the criteria is true, renew the offer for another week
      if(offer.criteria) {
          await Offer.findByIdAndUpdate(offer._id, { $set: {createdDate: currentDate}});
      } else {
          //otherwise, delete the offer
          await Offer.findByIdAndDelete(offer._id);
      }
  });
}

// Schedule to run every 7 days
const job3 = new cron.CronJob('* * */7 * *', handleExpiredOffers, null, true);
job3.start();

app.get("/", (req, res) => {
    res.send("Server is ready");
});


const port = 5000;

app.listen(5000, () => {
    console.log(`Server running at http://localhost:${port}`);
});

