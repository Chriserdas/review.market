const express = require('express');
const router = express.Router();

const SupermarketController = require('../controllers/SupermarketController');

//call localhost:5000/api/supermarket/store
router.post('/store', SupermarketController.store);
//call localhost:5000/api/supermarket/update
router.patch('/update', SupermarketController.update);
//call localhost:5000/api/supermarket/delete
router.post('/delete', SupermarketController.destroy);
//call localhost:5000/api/supermarket/search
router.post('/search', SupermarketController.search);

module.exports = router;