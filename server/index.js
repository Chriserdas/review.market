require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { User, Data, Supermarket } = require("./models/Schemas");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const adminData = require("./data/adminData");
const data = require('./data/product_category.json');
const supermarket = require("./data/supermarkets.json");

//connect to database
const url = "mongodb+srv://dionusia:dionusia@reviewmarket.rppj5dm.mongodb.net/reviewMarket?retryWrites=true&w=majority"
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

//search pois
app.get('/api/supermarket', async(req,res) => {
  const stores = await Supermarket.find();
  res.send(stores);
  /*stores.forEach(element => {
    res.send(element.features)
  });*/
});


app.get("/", (req, res) => {
    res.send("Server is ready");
});

const port = process.env.PORT || 5000;
app.listen(5000, () => {
    console.log(`Server running at http://localhost:${port}`);
});