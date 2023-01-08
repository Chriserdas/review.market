require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { User, Data, Supermarket, Offer } = require("./models/Schemas");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const users = require("./data/users");
const data = require('./data/product_category.json');
const supermarket = require("./data/supermarket.js");
const offer = require("./data/offer");
const supermarketRoutes = require('./routes/supermarket');
const prodcategRoutes = require('./routes/prodcateg');
const offerRoutes = require('./routes/offer');


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
app.use('/api/prodcateg', prodcategRoutes);
app.use('/api/offer', offerRoutes);


//insert product,categories,subcategories
app.get('/prodCateg', async(req, res) => {
  await Data.remove({});
   const createdProdCateg = await Data.insertMany(data);
   res.send({ createdProdCateg });
});

//insert admins directly to database
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
  await Offer.remove({});
  const createOffer = await Offer.insertMany(offer);
  res.send(createOffer);
});

//supermarkets with offers
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
    { $project: {"offer._id":1, "supermarkets.properties.name":1, "supermarkets.properties.shop":1, "supermarkets.geometry.coordinates":1 } }
   ]).then((result)=>{
        res.send(result);
   })
});


app.get('/api/offerProduct', async(req,res) => {
  Offer.aggregate([
    {
        $lookup:{
            from:"products",
            localField:"products",
            foreignField:"products._id",
            as:"products"
        }
    },
    { $project: { "products.name":1 } }
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

