const {Supermarket} = require("../models/Schemas");

//show the list of supermarkerts
const show = (req,res)=> {
    Supermarket.find()
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

//add supermarket
const store = (req,res)=>{
    let supermarketID = req.body.supermarketID
    if (mongoose.Types.ObjectId.isValid(supermarketID)) {return res.status(404).send(`Supermarket exist with id: ${supermarketID}`)}
    else{
        let supermarket = new Supermarket({
            type: req.body.type,
            properties:{
                "@id":"req.body.@id",
                brand: req.body.brand,
                "brand:wikidata": "req.body.brand:wikidata",
                "brand:wikipedia":"req.body.brand:wikipedia",
                name: req.body.name,
                opening_hours: req.body.opening_hours,
                shop: req.body.shop
            },
            geometry:{
                type: req.body.type,
                coordinates: req.body.coordinates
            },
            id: req.body.id
        })
        Supermarket.save()
        .then(response =>{
            res.json({
                message:"Supermarket added"
            })
        })
        .catch(erro=>{
            res.json({
                message:'An error occured'
            })
    
        })
    }
};

//update supermarket
const update = (req,res)=> {
    let supermarketID = req.body.supermarketID

    let updatedData = {
        type: req.body.type,
        properties:{
            "@id":"req.body.@id",
            brand: req.body.brand,
            "brand:wikidata": "req.body.brand:wikidata",
            "brand:wikipedia":"req.body.brand:wikipedia",
            name: req.body.name,
            opening_hours: req.body.opening_hours,
            shop: req.body.shop
        },
        geometry:{
            type: req.body.type,
            coordinates: req.body.coordinates
        },
        id: req.body.id
    }

    Supermarket.findByIdAndUpdate(supermarketID, {$set: updatedData})
    .then(() => {
        res.json({
            message:'Supermarket updated successfully!'
        })
    })
    .catch(error =>{
        res.json({
            message:'An error occured!'
        })
    })
};

//delete supermarket
const destroy = (req,res)=>{
    let supermarketID = req.body.supermarketID
    Supermarket.findOneAndRemove(supermarketID)
    .then(() => {
        req.json({
            message:'Supermarket deleted successfully!'
        })
    })
    .catch(error => {
        req.json({
            message:'An error occured'
        })
    })
};




module.exports = {show,store, update, destroy};