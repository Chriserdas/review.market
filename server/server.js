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
const products = require('./data/products.js');
const categories = require('./data/categories.js');
const supermarket = require("./data/supermarket.js");
const offer = require("./data/offer");
const { use } = require("./routes/users");
const { features } = require("./data/supermarket.js");
const { product } = require("./controllers/ProductController");
const upload = multer({storage: multer.memoryStorage()});


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
app.post('/uploadData', upload.single('file') ,async(req, res) => {
   let string = req.body.selected
   let data = req.file.buffer.toString();

   console.log(string);
   if(string == "Products"){
        // Check if products with the same data already exist
        /*const existingProducts = await Product.find({ "name": { $in: data.products.map(p => p.name) } });

        if (existingProducts.length > 0) {
            res.send( { message: "Duplicate product found."});
        }
        // If no duplicate products found, insert the new products
        const createdProduct = await Product.insertMany(data.products);*/
        /*const newProducts = await Product.updateOne({ name: {$in:data.map(d => d.name)} }, { upsert: true })
        console.log(newProducts);*/
        data.products.forEach(product=>{
            let filter = { id: product.id };
            Product.updateMany(filter, { upsert: true }, (err, res) => {
                if (err) throw err;
                console.log(`${res.matchedCount} documents matched the filter and ${res.modifiedCount} documents were updated`);
            });
        })
   }
   if(string == "Categories"){
        /*const existingCategories = await Category.find({ "name": { $in: data.categories.map(p => p.name) } });

        if (existingCategories.length > 0) {
            res.send( { message: "Duplicate category found."});
        }
        const createdCategory= await Category.insertMany(data.categories);*/
        
        const newProducts = await Category.updateOne({ id: {$in:data.map(d => d.id)} }, { upsert: true })
        console.log(newProducts);
   }
   if(string == "Supermarkets"){
        /*const existingSupermarkets = await Supermarket.find({ "id": { $in: data.features.map(p => p.name) } });

        if (existingSupermarkets.length > 0) {
            res.send( { message: "Duplicate supermarket found."});
        }
        const createdSupermarket = await Supermarket.insertMany(data.features);*/
        const newProducts = await Supermarket.updateOne({ id: {$in:data.map(d => d.id)} }, { upsert: true })
        console.log(newProducts);
   }
});

/*
app.get('/categories', async(req, res) => {
   const createdCategory= await Category.insertMany(categories.categories);
   res.send(createdCategory);
});
//insert supermarket
app.get('/supermarket', async(req, res) => {
    const createdSupermarket = await Supermarket.insertMany(supermarket.features);
    res.send({ createdSupermarket });
  });

//insert supermarket
app.get('/supermarket', async(req, res) => {
  const createdSupermarket = await Supermarket.insertMany(supermarket.features);
  res.send({ createdSupermarket });
});
*/
//insert users
app.get('/user', async(req, res) => {
    await User.remove({})
    const createdUsers = await User.insertMany(users);
    res.send({ createdUsers });
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

//chart1
app.post('/api/chart1', async(req,res) => {
    let date = req.body.date
    let year = parseInt(date.substring(0, 4));  //extract the year from the date
    let month = parseInt(date.substring(5, 7))-1; //extract the month from the date
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
                offers: { $push: "$$ROOT" }
            }
        }
    ]).then(response=>{
        res.json(response)
    })
});

app.get("/", (req, res) => {
    res.send("Server is ready");
});


const port = 5000;

app.listen(5000, () => {
    console.log(`Server running at http://localhost:${port}`);
});

