const {Category} = require("../models/Schemas");

//show the list of products,categories
const show = (req,res)=> {
    Category.find()
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

//add categories,subcategories
const store = (req,res)=>{
    let categoryID = req.body.categoryID
    if (mongoose.Types.ObjectId.isValid(categoryID)){return res.status(404).send(`Category exist with id: ${categoryID}`);}
    else{
        let Category = new Category({
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
        .catch(error=>{
            res.json({
                message:'An error occured'
            })

        })
    }
};

//update categories, subcategories
const update = (req,res)=> {
    let categoryID = req.body.categoryID

    let updatedCategory = {
                id:req.body.id,
                name:req.body.name,
                subcategories:[
                    {
                        name:req.body.name,
                        uuid:req.body.uuid
                    }
                ]
    }

    Category.findByIdAndUpdate(categoryID, {$set: updatedCategory})
    .then(() => {
        res.json({
            message:'Category updated successfully!'
        })
    })
    .catch(error =>{
        res.json({
            message:'An error occured!'
        })
    })
};

//delete categories,subcategories
const destroy = (req,res)=>{
    let categoryID = req.body.categoryID
    Category.findOneAndRemove(categoryID)
    .then(() => {
        req.json({
            message:'Category deleted successfully!'
        })
    })
    .catch(error => {
        req.json({
            message:'An error occured'
        })
    })
};


module.exports = {show,store,update,destroy};