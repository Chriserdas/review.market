const express = require('express');
const router = express.Router();

const OfferController = require('../controllers/OfferController');

//call localhost:5000/api/offer
router.get('/', OfferController.show);
//call localhost:5000/api/offer/store
router.post('/store', OfferController.store)
//call localhost:5000/api/offer/delete
router.post('/delete', OfferController.destroy);

module.exports = router;