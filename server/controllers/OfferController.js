const {Offer, User} = require("../models/Schemas");
const mongoose = require("mongoose");

//show the list of offers
const show = (req,res)=> {
    Offer.find()
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

//add offer
const store = (req,res)=>{
    let offerID = req.body.offerID
    if (mongoose.Types.ObjectId.isValid(offerID)){return res.status(404).send(`Offer exist with id: ${offerID}`);}
    else{
        let offer = new Offer({
            products: req.body.type,
            supermarkets: req.body.type,
            criteria: req.body.criteria,
            price: req.body.price,
            createdBy: req.body.createdBy,
            createdDate: req.body.createdDate,
            likes:req.body.likes,
            createdAt:req.body.createdAt,
            dislikes: req.body.dislikes,
            stock:req.body.stock
        })
        Offer.save()
        .then(response =>{
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
    }else if(dislike){
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $pull: {dislikes: userID}, $addToSet: { likes: userID } },
            { new: true }
        );
    }else{
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $addToSet: { likes: userID } },
            { new: true }
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
    }else if(like){
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $pull: {likes: userID}, $addToSet: { dislikes: userID } },
            { new: true }
        );
    }else{
        offer = await Offer.findOneAndUpdate(
            { _id: offerID },
            { $addToSet: { dislikes: userID } },
            { new: true }
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

module.exports = {show,store,destroy, likeOffer, dislikeOffer, stock};