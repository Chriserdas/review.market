const fs = require('fs')
//const products = require('./products.js');

const jsonData = JSON.stringify(products)

fs.writeFile("products.json", jsonData, (err) =>{
    if(err){console.log(err)}
})