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
   await User.remove({});
   const createdProdCateg = await Data.insertMany(data);
   res.send({ createdProdCateg });
});

//insert supermarket
app.get('/supermarket', async(req, res) => {
<<<<<<< Updated upstream
  await Data.remove({});
  /*const createdSupermarket = await Supermarket.insertMany(supermarket.features);
  res.send({ createdSupermarket });*/
=======
  //await Supermarket.remove({});
  const createdSupermarket = await Supermarket.insertMany(supermarket.features);
  res.send({ createdSupermarket });
>>>>>>> Stashed changes
});

//insert offer
app.get('/offer', async(req,res) => {
  await Offer.remove({});
  const createOffer = await Offer.insertMany(offer.offer);
  res.send(createOffer);
});

<<<<<<< Updated upstream
//supermarkets with offers
app.get('/api/getCurrentLocation', async(req,res) => {
=======

//supermarkets with offers
app.get('/api/getCurrentLocation', async(req,response) => {

>>>>>>> Stashed changes
   Offer.find().populate('supermarkets').exec((error, results) => {
    
        if (error) {
            console.log(error);
        } 
        else {
            const ids = results.map(data => data.supermarkets);
            Supermarket.find({_id:{$in:ids}}).exec((error,supermarket)=>{
                if (error) {
                    console.log(error);
                }
                else{
                    response.send(
                        /*supermarket_names : supermarket.map(obj => obj.properties.name || obj.properties.shop),
                        supermarket_coordinates : supermarket.map(obj => obj.geometry.coordinates)*/
                        supermarket
                    )
                    
                }
            });
        }
    });
});

//search pois
app.get('/api/supermarket', async(req,res) => {
   await Supermarket.find()
   .then((result) => {
        res.send(result);
   })
   .catch((err) => {
        console.log(err);
   })
});


app.get("/", (req, res) => {
    res.send("Server is ready");
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



