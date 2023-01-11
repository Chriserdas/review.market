const {Offer} = require("../models/Schemas");

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
        likeCount:req.body.likeCount,
        createdAt:req.body.createdAt,
        dislikeCount: req.body.dislikeCount,
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
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No offer with id: ${id}`);
    
    const offer = await Offer.findById(id);

    const updatedOffer = await Offer.findByIdAndUpdate(id, { likeCount: offer.likeCount + 1 }, { new: true });
    
    res.json(updatedOffer);
}

//update dislike counter
const dislikeOffer = async (req, res) => {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No offer with id: ${id}`);
    
    const offer = await Offer.findById(id);

    const updatedOffer = await Offer.findByIdAndUpdate(id, { dislikeCount: offer.dislikeCount + 1 }, { new: true });
    
    res.json(updatedOffer);
}

module.exports = {show,store,destroy, likeOffer, dislikeOffer};