const {Product} = require("../models/Schemas");

//show the list of products
const show = (req,res)=> {
    Product.find()
    .then(response=>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message:'An error occured!'
        })
    })
};

//add products
const store = (req,res)=>{
    let productID = req.body.productID
    if (mongoose.Types.ObjectId.isValid(productID)) {return res.status(404).send(`Product exist with id: ${productID}`)}
    else{
        let product = new Product({
            id:req.body.id,
            name:req.body.name,
            price:req.body.price,
            image:req.body.image,
            category:req.body.category,
            subcategory:req.body.subcategory
        });
        Product.save()
        .then(response =>{
            res.json({
                message:"product added"
            })
        })
        .catch(error=>{
            res.json({
                message:'An error occured'
            })

        })
    }
};

//update product
const update = (req,res)=> {
    let productID = req.body.productID

    let updatedProduct = {
                id:req.body.id,
                name:req.body.name,
                price:req.body.price,
                image:req.body.image,
                category:req.body.category,
                subcategory:req.body.subcategory
    }

    Product.findByIdAndUpdate(productID, {$set: updatedProduct})
    .then(() => {
        res.json({
            message:'Product updated successfully!'
        })
    })
    .catch(error =>{
        res.json({
            message:'An error occured!'
        })
    })
};

//delete product
const destroy = (req,res)=>{
    let productID = req.body.productID
    Product.findOneAndRemove(productID)
    .then(() => {
        req.json({
            message:'Product deleted successfully!'
        })
    })
    .catch(error => {
        req.json({
            message:'An error occured'
        })
    })
};

//find product by category and subcategory
const product = (req,res)=> {
    let categoryID = req.body.categoryID
    let subcategoryID = req.body.subcategoryID
    Product.find({
        "category": categoryID,
        "subcategory": subcategoryID
      })
    .then(response=>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message:'An error occured!'
        })
    })
};

module.exports = {show,store,update,destroy,product};