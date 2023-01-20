const {Offer, User} = require("../models/Schemas");
const mongoose = require("mongoose");

// Function to calculate average offer price for previous day
const calculateAvgPrice = async (productID) => {
    const currentDate = new Date();
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    // offers from previous day
    const offers = await Offer.find({ products: productID, createdDate: { $gte: previousDay } });
    let sum = 0;
    offers.forEach(offer => {
        sum += offer.price;
    });
    let avgPrice = sum / offers.length;
    if (isNaN(avgPrice)) {
        avgPrice = 0;
    }
    return avgPrice;
}

const calculateAvgPriceWeek = async (productId) => {
    const currentDate = new Date();
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(currentDate.getDate() - 7);
    // offer from previous week
    const offers = await Offer.find({ products: productId, createdDate: { $gte: previousWeek } });
    let sum = 0;
    offers.forEach(offer => {
        sum += offer.price;
    });
    let avgPriceWeek = sum / offers.length;
    if (isNaN(avgPriceWeek)) {
        avgPriceWeek = 0;
    }
    return avgPriceWeek;
}

//add offer
const store = async(req,res)=>{
    let userId = req.body.userId
    let stock = req.body.stock
    let price = req.body.price
    let productId = req.body.productId
    let supermarketId = req.body.supermarketId

    const avgPrice = await calculateAvgPrice(productId);
    const avgPriceWeek = await calculateAvgPriceWeek(productId);
    if(typeof stock ==='boolean' && !isNaN(price)){
        const existingOffer = await Offer.findOne({
            products: productId,
            supermarkets: supermarketId,
        });

        if(existingOffer){
            if(price < existingOffer.price * 0.2) {
                await Offer.deleteOne(existingOffer)
                if(price < avgPrice * 0.2){
                    let offer = new Offer({
                        products: productId,
                        supermarkets: supermarketId,
                        criteria: true,
                        price: price,
                        criteria:true,
                        createdBy: userId,
                        createdDate: req.body.createdDate,
                        likes:req.body.likes,
                        dislikes: req.body.dislikes,
                        stock:stock
                    })
                    await offer.save().then(response =>{
                        
                        res.json({
                            message:"Offer added"
                        })
                    }).catch(erro=>{
                        res.json({
                            message:'An error occured'
                        })
                    })
                    await User.findOneAndUpdate(
                        {_id: userId},
                        {$inc: {score: 50}},
                        {new: true}
                    );
                }else if(price < avgPriceWeek * 0.2){
                    let offer = new Offer({
                        products: productId,
                        supermarkets: supermarketId,
                        criteria: true,
                        price: price,
                        criteria:true,
                        createdBy: userId,
                        createdDate: req.body.createdDate,
                        likes:req.body.likes,
                        dislikes: req.body.dislikes,
                        stock:stock
                    })
                    await offer.save().then(response =>{
                        
                        res.json({
                            message:"Offer added"
                        })
                    }).catch(erro=>{
                        res.json({
                            message:'An error occured'
                        })
                    })
                    await User.findOneAndUpdate(
                        {_id: userId},
                        {$inc: {score: 20}},
                        {new: true}
                    );
                }
                else{
                    let offer = new Offer({
                        products: productId,
                        supermarkets: supermarketId,
                        criteria: req.body.criteria,
                        price: price,
                        criteria: false,
                        createdBy: userId,
                        createdDate: req.body.createdDate,
                        likes:req.body.likes,
                        dislikes: req.body.dislikes,
                        stock:stock
                    })
                    await offer.save().then(response =>{
                        res.json({
                            message:"Offer added"
                        })
                    })
                    .catch(erro=>{
                        res.json({
                            message:'An error occured'
                        })
                    })
                }
            } 
            else {
                res.json({message: "Offer for the same product and store already exists"}) 
            }
        }
        else {
            if(price < avgPrice * 0.2){
                console.log("price day")
                let offer = new Offer({
                    products: productId,
                    supermarkets: supermarketId,
                    criteria: true,
                    price: price,
                    createdBy: userId,
                    createdDate: req.body.createdDate,
                    likes:req.body.likes,
                    dislikes: req.body.dislikes,
                    stock:stock
                })
                await offer.save().then(response =>{
                    res.json({
                        message:"Offer added"
                    })
                })
                .catch(erro=>{
                    res.json({
                        message:'An error occured'
                    })
                })
                await User.findOneAndUpdate(
                    {_id: userId},
                    {$inc: {score: 50}},
                    {new: true}
                );
            }else if(price < avgPriceWeek * 0.2){
                let offer = new Offer({
                    products: productId,
                    supermarkets: supermarketId,
                    criteria: true,
                    price: price,
                    criteria:true,
                    createdBy: userId,
                    createdDate: req.body.createdDate,
                    likes:req.body.likes,
                    dislikes: req.body.dislikes,
                    stock:stock
                })
                await offer.save().then(response =>{
                    
                    res.json({
                        message:"Offer added"
                    })
                }).catch(erro=>{
                    res.json({
                        message:'An error occured'
                    })
                })
                await User.findOneAndUpdate(
                    {_id: userId},
                    {$inc: {score: 20}},
                    {new: true}
                );
            }
            else{
                let offer = new Offer({
                    products: productId,
                    supermarkets: supermarketId,
                    criteria: req.body.criteria,
                    price: price,
                    criteria: false,
                    createdBy: userId,
                    createdDate: req.body.createdDate,
                    likes:req.body.likes,
                    dislikes: req.body.dislikes,
                    stock:stock
                })
                await offer.save().then(response =>{
                    res.json({
                        message:"Offer added"
                    })
                })
                .catch(erro=>{
                    res.json({
                        message:'An error occured'
                    })
                })
            }
        }
    }else{
        res.send("invalid values")
    }
};

//delete offer
const destroy = (req,res)=>{
    let offerID = req.body.offerID
    Offer.findOneAndRemove(offerID)
    .then(() => {
        req.json({
            message:'Offer deleted successfully!'
        })
    })
    .catch(error => {
        req.json({
            message:'An error occured'
        })
    })
};

//update likes
const likeOffer = async (req, res) => {
    let offerID = req.body.offerID
    let userID = req.body.userID

    const check = await Offer.findOne({ _id: offerID, likes: { $in: [userID] } });
    const dislike = await Offer.findOne({ _id: offerID, dislikes: { $in: [userID] }});

    if (!mongoose.Types.ObjectId.isValid(offerID)) return res.status(404).send(`No offer with id: ${offerID}`);
    
    let offer;
    if(check){
        offer = await Offer.findOneAndUpdate(
            { _id: offerID, likes: { $in: [userID] } },
            { $pull: { likes: userID } },
            { new: true }
        );
        await User.findOneAndUpdate(
            {_id: offer.createdBy},
            {$inc: {score: -5}},
            {new: true}
        );
    }else if(dislike){
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $pull: {dislikes: userID}, $addToSet: { likes: userID } },
            { new: true }
        );
        await User.findOneAndUpdate(
            {_id: offer.createdBy},
            { $inc: {score: 5}},
            {new: true}
        );
    }else{
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $addToSet: { likes: userID }},
            { new: true }
        );
        await User.findOneAndUpdate(
            {_id: offer.createdBy},
            { $inc: {score: 5}},
            {new: true}
        );
    }
    res.send(offer);
}

//update dislikes
const dislikeOffer = async (req, res) => {
    let offerID = req.body.offerID
    let userID = req.body.userID


    const check = await Offer.findOne({ _id: offerID, dislikes: { $in: [userID] } });
    const like = await Offer.findOne({ _id: offerID, likes: { $in: [userID] }});

    if (!mongoose.Types.ObjectId.isValid(offerID)) return res.status(404).send(`No offer with id: ${offerID}`);
    
    let offer;
    if(check){
        offer = await Offer.findOneAndUpdate(
            { _id: offerID, dislikes: { $in: [userID] } },
            { $pull: { dislikes: userID } },
            { new: true }
        );
        await User.findOneAndUpdate(
            {_id: offer.createdBy},
            {$inc: {score: 1}},
            {new: true}
        );
    }else if(like){
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $pull: {likes: userID}, $addToSet: { dislikes: userID } },
            { new: true }
        );
        await User.findOneAndUpdate(
            {_id: offer.createdBy},
            {$inc: {score: -1}},
            {new: true}
        );
    }else{
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $addToSet: { dislikes: userID } },
            { new: true }
        );
        await User.findOneAndUpdate(
            {_id: offer.createdBy},
            {$inc: {score: -1}},
            {new: true}
        );
    }
    res.send(offer);

}

//update stock
const stock = async (req, res) => {
    let offerID = req.body.offerID
    let offerStock = req.body.offerStock;

    if (!mongoose.Types.ObjectId.isValid(offerID)) return res.status(404).send(`No offer with id: ${offerID}`);
    

    const updatedStock = await Offer.findOneAndUpdate(
        {_id:offerID}, 
        { $set: { stock: !offerStock } }, { new: true });
    
    res.json(updatedStock);
}

//match supermarket which has at least one offer for the selected category
const show = async (req, res) => {
    let categoryId = req.body.categoryId

    Offer.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "products"
            }
        },
        {
            $match: { "products.category": categoryId }
        },
        {
            $lookup: {
                from: "supermarkets",
                localField: "supermarkets",
                foreignField: "_id",
                as: "supermarkets"
            }   
        },
        {$project: {"price":1, "stock":1, "createdBy":1, "createdDate":1, "likes":1, "dislikes":1, "supermarkets._id":1,"supermarkets.properties.name":1, "supermarkets.properties.shop":1, "supermarkets.geometry.coordinates":1, "products._id":1 ,"products.name":1 } },
    ]).then(response=>{
        res.json(response)
    }).catch(error => {
        res.json({
            message:'An error occured!'
        })
    })
}

module.exports = {show,store,destroy, likeOffer, dislikeOffer, stock};