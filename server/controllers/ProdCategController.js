const {Data} = require("../models/Schemas");

//show the list of products,categories
const show = (req,res)=> {
    Data.find()
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
    let data = new Data({
        products:[
            {
                id:req.body.id,
                name:req.body.name,
                category:req.body.category,
                subcategory:req.body.subcategory
            }
        ],
        categories:[
            {
                id:req.body.id,
                name:req.body.name,
                subcategories:[
                    {
                        name:req.body.name,
                        uuid:req.body.uuid
                    }
                ]
            }
        ]
    });
    Data.save()
    .then(response =>{
        res.json({
            message:"data added"
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
    let dataID = req.body.dataID

    let updatedData = {
        products:[
            {
                id:req.body.id,
                name:req.body.name,
                category:req.body.category,
                subcategory:req.body.subcategory
            }
        ],
        categories:[
            {
                id:req.body.id,
                name:req.body.name,
                subcategories:[
                    {
                        name:req.body.name,
                        uuid:req.body.uuid
                    }
                ]
            }
        ]
    }

    Data.findByIdAndUpdate(dataID, {$set: updatedData})
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
    let dataID = req.body.dataID
    Data.findOneAndRemove(dataID)
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