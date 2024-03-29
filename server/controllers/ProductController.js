const {Product, Category} = require("../models/Schemas");

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

//add categories, subcategories 
const upload = (req,res)=>{
    let categoryID = req.body.categoryID
    if (mongoose.Types.ObjectId.isValid(categoryID)) {return res.status(404).send(`Category exist with id: ${categoryID}`)}
    let category = new Category({
                id:req.body.id,
                name:req.body.name,
                subcategories:[
                    {
                        name:req.body.name,
                        uuid:req.body.uuid
                    }
                ]
    });
    Category.save()
    .then(response =>{
        res.json({
            message:"Category added"
        })
    })
    .catch(erro=>{
        res.json({
            message:'An error occured'
        })

    })
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
    let categoryID = req.body.categoryID;
    let subcategoryID = req.body.subcategoryID;
    
    Product.find({
        "category": categoryID,
        "subcategory": subcategoryID
    })
    .then(response=>{
        res.json(response)
    })
    .catch(error => {
        res.json({
            message:'An error occured!'
        })
    })
};

//search products for control search
const search= (req,res)=> {
    let productString = req.body.productString
    Product.aggregate([
        {
            $match: { name: { $regex: `^${productString}`, $options: 'i' } }
        },
        {
            $project: { 
                name:1,
                _id:1
            }
        }
    ]).then(response=>{
        res.json(response)
    }).catch(error => {
        res.json({
            message:'An error occured!'
        })
    })
};

module.exports = {store,upload,update,destroy,product,search};