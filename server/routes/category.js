const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/CategoryController');

//call localhost:5000/api/category
router.get('/', CategoryController.show);
//call localhost:5000/api/category/store
router.post('/store', CategoryController.store)
//call localhost:5000/api/category/update
router.post('/update', CategoryController.update);
//call localhost:5000/api/category/delete
router.post('/delete', CategoryController.destroy);

module.exports = router;