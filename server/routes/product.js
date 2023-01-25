const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');

//call localhost:5000/api/product/store
router.post('/store', ProductController.store)
//call localhost:5000/api/product/upload   //this is for categories
router.post('/upload', ProductController.upload)
//call localhost:5000/api/product/update
router.patch('/update', ProductController.update);
//call localhost:5000/api/product/delete
router.post('/delete', ProductController.destroy);
//call localhost:5000/api/product/getProducts
router.post('/product', ProductController.product);
//call localhost:5000/api/product/search
router.post('/search', ProductController.search);

module.exports = router;