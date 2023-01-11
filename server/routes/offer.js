const express = require('express');
const router = express.Router();

const OfferController = require('../controllers/OfferController');

//call localhost:5000/api/offer
router.get('/', OfferController.show);
//call localhost:5000/api/offer/store
router.post('/store', OfferController.store)
//call localhost:5000/api/offer/delete
router.post('/delete', OfferController.destroy);
//call localhost:5000/api/offer/likeOffer
router.patch('/likeOffer', OfferController.likeOffer);
//call localhost:5000/api/offer/dislikeOffer
router.patch('/dislikeOffer', OfferController.dislikeOffer);

module.exports = router;