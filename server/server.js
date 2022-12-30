require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { User, Data, Supermarket, Offer } = require("./models/Schemas");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const adminData = require("./data/adminData");
const data = require('./data/product_category.json');
const supermarket = require("./data/supermarkets.json");
const offer = require("./data/offer");

//connect to database
const url = "mongodb://127.0.0.1:27017/reviewMarket";
async function connect(){
    try{
        await mongoose.connect(url);
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

//insert admins directly to database
app.get('/adminData', async(req, res) => {
  //await User.remove({});
  const createdUsers = await User.insertMany(adminData.users);
  res.send({ createdUsers });
});

//insert product,categories,subcategories
app.get('/prodCateg', async(req, res) => {
   await Data.remove({});
   const createdProdCateg = await Data.insertMany(data);
   res.send({ createdProdCateg });
});

//insert supermarket
app.get('/supermarket', async(req, res) => {
  await Supermarket.remove({});
  const createdSupermarket = await Supermarket.insertMany(supermarket);
  res.send({ createdSupermarket });
});

//insert offer
app.get('/offer', async(req,res) => {
  const createOffer = await Offer.insertMany(offer);
  res.send(createOffer);
});

app.get('/api/offer', async(req,res) => {
  Offer.aggregate([{
    $lookup: {
        from: "supermarkets", // collection name in db
        localField: "supermarket_id",
        foreignField: "_id",
        as: "supermarkets"
    }
}]).exec(function(err, _id) {
});
});

//search pois
app.get('/api/supermarket', async(req,res) => {
   await Supermarket.find()
   .then((result) => {
    res.send(result)
   })
   .catch((err) => {
    console.log(err);
   })
});


app.get("/", (req, res) => {
    res.send("Server is ready");
});


const port = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log(`Server running at http://localhost:${port}`);
});