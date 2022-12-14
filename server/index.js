require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const User = require('./models/user')


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());


const port = process.env.PORT;
app.listen(port, console.log(`Listening on port ${port}...`));