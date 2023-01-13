const {Offer, User} = require("../models/Schemas");

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
    let offer = new Offer({
        products: req.body.type,
        supermarkets: req.body.type,
        price: req.body.price,
        criteria: req.body.criteria,
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

//update like counter
const likeOffer = async (req, res) => {
    let offerID = req.body.offerID
    let userID = req.body.userID

    if (!mongoose.Types.ObjectId.isValid(offerID)) return res.status(404).send(`No offer with id: ${offerID}`);
    
    const offer = await Offer.findById(offerID);

    const updatedOffer = await Offer.findByIdAndUpdate(offerID, { $push: { 'offer.likes': userID } }, { new: true });

    res.json(updatedOffer);
}

//update dislike counter
const dislikeOffer = async (req, res) => {
    let offerID = req.body.offerID
    let userID = req.body.userID

    if (!mongoose.Types.ObjectId.isValid(offerID)) return res.status(404).send(`No offer with id: ${offerID}`);
    
    const offer = await Offer.findById(offerID);

    const updatedOffer = await Offer.findByIdAndUpdate(offerID, { $push: { 'offer.dislikes': userID } }, { new: true });
    
    res.json(updatedOffer);
}

//update dislike counter
const stock = async (req, res) => {
    let offerID = req.body.offerID
    let userID = req.body.userID

    if (!mongoose.Types.ObjectId.isValid(offerID)) return res.status(404).send(`No offer with id: ${offerID}`);
    
    const offer = await Offer.findById(offerID);

    const updatedStock = await Offer.findByIdAndUpdate(offerID, { $set: { 'offer.stock': !offer.stock } }, { new: true });
    
    res.json(updatedStock);
}

module.exports = {show,store,destroy, likeOffer, dislikeOffer, stock};