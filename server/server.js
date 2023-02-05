require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;
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
const multer = require('multer');
const users = require("./data/users");
//const products = require('./data/products.js');
const categories = require('./data/categories.json');
//const supermarket = require("./data/supermarket.js");
const offer = require("./data/offer");
const { use } = require("./routes/users");
//const { features } = require("./data/supermarket.js");
const { product } = require("./controllers/ProductController");
const upload = multer({storage: multer.memoryStorage()});

const moment = require('moment');
const { date } = require("joi");

const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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

//get categories
app.get('/categories',async(req, res) => {
    res.set({
        'Cache-Control': 'public',
        'Expires': oneMonthFromNow.toUTCString(),
    });
    const createdCategory= await Category.insertMany(categories.categories);
    res.send(createdCategory);
});


//upload data
app.post('/uploadData', upload.single('file') ,async(req, res) => {
   let string = req.body.selected
   let data = JSON.parse(req.file.buffer.toString());
   if(string == "Products"){
       data.products.forEach(product => {
            Product.findOne({name: product.name}, function(err, existingProduct) {
                if (!existingProduct) {
                    Product.insertMany(product);
                }
            });
        });
    }
   if(string == "Categories"){
        data.categories.forEach(categories => {
            Category.findOne({name: categories.name}, function(err, existingCategory) {
                if (!existingCategory) {
                    Category.insertMany(categories);
                }
            });
        });
   }
   if(string == "Supermarkets"){
        data.features.forEach(supermarket => {
            Supermarket.findOne({name: supermarket.name}, function(err, existingSupermarket) {
                if (!existingSupermarket) {
                    Supermarket.insertMany(supermarket);
                }
            });
        });
    }

    res.send({message:string.toString() + " were uploaded!",color:'green'})
});

//delete data
app.post('/api/deleteAll',async(req, res) => {
    let string = req.body.selected
    if(string == "Products"){
        await Product.deleteMany({})
     }
    if(string == "Categories"){
        await Category.deleteMany({})
    }
    if(string == "Supermarkets"){
        await Supermarket.deleteMany({})
     }
    
    res.send({message:string.toString() + " were deleted!",color:'#dd3b39'})
});

//insert users default
app.get('/user', async(req, res) => {
    await User.remove({})
    const createdUsers = await User.insertMany(users);
    res.send({ createdUsers });
});

//insert offer default
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
    { $project: {"criteria":1,"likes":1, "stock":1, "dislikes":1, "price":1, "_id":1,"createdDate":1, "createdBy":1,"products._id":1, "products.name":1, "products.image":1,"supermarkets.properties.name":1,"supermarkets.properties.shop":1, "supermarkets.geometry.coordinates":1, "user._id":1,"user.username":1 } }
   ]).then((result)=>{
        res.send(result);
   })
});

//supermarkets location with offers
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

//profile
app.post('/api/AccountData', async(req,res) => {
    let userId = req.body.userId
    User.find({"_id": userId,},{"username":1, "score":1, "token":1, "totalScore":1, "totalToken":1})
    .then(response=>{
        res.json(response)
    })
});

//for user history of likes,dislikes,offers
app.post('/api/history', async(req,res) => {
    let userId = new ObjectId(req.body.userId);
    Offer.aggregate([
        {
            $match:{
                $or: [
                    { likes: { $in: [userId] } },
                    { dislikes: { $in: [userId] } },
                    { createdBy: userId }
                ]
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
                from:'supermarkets',
                localField:"supermarkets",
                foreignField:'_id',
                as:"supermarkets"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                'products.name':1,
                'supermarkets.properties.name':1,
                'supermarkets.properties.shop':1,
                createdDate:1,
                liked: {
                    $cond: {
                        if: { $in: [userId, "$likes"] },
                        then: true,
                        else: false
                    }
                },
                disliked: {
                    $cond: {
                        if: { $in: [userId, "$dislikes"] },
                        then: true,
                        else: false
                    }
                },
                createdByUser: {
                    $cond: {
                        if: {$eq: [userId, "$createdBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        }
    ]).then(result=>{
        res.json(result)
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
                user.totalToken += 100;
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
                  user.totalToken += (tokens * userScore) / totalscore;
                  user.totalToken = Math.round(user.totalToken);
                  user.token = Math.round(100 + (tokens * userScore) / totalscore); //tokens each month only
                  user.save();
                })
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

//chart1
app.post('/api/chart1', async(req,res) => {
    let year = req.body.year; 
    let month = req.body.month; 
    Offer.aggregate([
        { 
            $match: { 
                $and: [
                    { "createdDate": { $gte: new Date(year, month, 1) } }, 
                    { "createdDate": { $lt: new Date(year, month + 1, 1) } }
                ]
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDate" } },
                offers: { $push: "$$ROOT" },
            }
        },
        {
            $project: {
                _id: 1,
                offerCount: {$size: "$offers"}
            }
        }
    ]).then(response=>{
        res.json(response)
    })
});

//leaderboard
app.post('/api/leaderboard', async(req,res) => {
    const number = req.body.number;
    if(number>=0){
        const users = await User.find({},{username:1,totalScore:1,token:1,totalToken:1}).sort({totalScore:-1,username:1}).skip(number).limit(10)
        res.send(users);
    }
    
});

//server is running
app.get("/", (req, res) => {
    res.send("Server is ready");
});

//function to calculate average offer price
const calculateAvgPrice = async (productId,date) => {
    const start = new Date(date.setUTCHours(0,0,0,0));
    const end = new Date(date.setUTCHours(23,59,59,999));
    const offers = await Offer.find({ products: productId, createdDate: {  $gte: start, $lt: end } });
    let sum = 0;
    offers.forEach(offer => {
        sum += offer.price;
    });
    let avgPrice = sum / offers.length;
    if (isNaN(avgPrice)) {
        avgPrice = 0;
    }
    return avgPrice;
}

//function to calculate avg price a week before
const calculateAvgPriceWeek = async (productId,date) => {
    const currentDate = date
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(currentDate.getDate() - 7);
    // offer from previous week
    const offers = await Offer.find({ products: productId, createdDate: { $gte: previousWeek } });
    let sum = 0;
    offers.forEach(offer => {
        sum += offer.price;
    });
    let avgPriceWeek = sum / offers.length;
    if (isNaN(avgPriceWeek)) {
        avgPriceWeek = 0;
    }
    return avgPriceWeek;
}

//matches for chart2
async function getOffersPerDay(date,categoryId,subcategoryId){
    const start = new Date(date.setUTCHours(0,0,0,0));
    const end = new Date(date.setUTCHours(23,59,59,999));
    return new Promise((resolve, reject) => {
        Offer.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                $unwind: "$products"
            },
            {
                $match: {
                    $and:[
                        {"createdDate": { $gte: start, $lt: end }},
                        {"products.category": categoryId},
                        subcategoryId ? {"products.subcategory": subcategoryId} : {}
                    ]
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDate" } },
                    offers: { $push: "$$ROOT" },
                }
            },
        ]).then((response) => {
            resolve(response);
        })
    })
    
}

//calculate avgDiscount final
async function avgDiscount(data, date){
    return new Promise((resolve, reject) => {
                let sumPrice = 0;
                let total = 0;
                let offerCount = 0;
                let result = 0;
                const promises = data.map(async(offer)=>{
                    const avgPrice = await calculateAvgPrice(offer.products,date); 
                    const avgPriceWeek = await calculateAvgPriceWeek(offer.products,date);
                    sumPrice = Math.abs(avgPriceWeek - avgPrice);
                    total += sumPrice;
                    offerCount += 1;
                });
                
                Promise.all(promises).then(() => {
                    result = total / offerCount;
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
    });
}

//chart2
app.post("/chart2", (req, res) => {
    let categoryId = req.body.categoryId;
    let subcategoryId = req.body.subCategoryId;
    let date = new Date(req.body.date);
    let dates = [];
    let discounts = [];
    
    console.log(date)
    for(let i = 1;i<=7; ++i){
        let discountDate = new Date(date);
        dates.push(discountDate);
        date.setDate(date.getDate() - 1);
    }
    const promises = dates.map(discountDate => {
        return getOffersPerDay(discountDate, categoryId, subcategoryId).then((response) => {
            if(response.length!==0){
                return avgDiscount(response[0].offers, date).then(result => {
                    discounts.push({date:discountDate,result:result});
                });
            }
            else{
                discounts.push({date:discountDate,result:0})
            }
        })
    });
    Promise.all(promises).then(() => {
        discounts.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        res.send(discounts);
    });
});

app.listen(5000, () => {
    console.log(`Server running at http://localhost:5000`);
});

