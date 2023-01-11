const {Product} = require("../models/Schemas");

//show the list of products,categories
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

//add products,categories
const store = (req,res)=>{
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
    .catch(erro=>{
        res.json({
            message:'An error occured'
        })

    })
};

//update product,categories
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

//delete product,categorie
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


module.exports = {show,store,update,destroy};