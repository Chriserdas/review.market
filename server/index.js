require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const User = require('./models/user')


// database connection
mongoose
  .connect(process.env.DB || "mongodb://localhost" , {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database successfully connected"))
  .catch((err) => console.log(err));

  
// middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ready");
});

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server running at http://localhost:${port}`);
});