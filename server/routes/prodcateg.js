const express = require('express');
const router = express.Router();

const ProdCategController = require('../controllers/ProdCategController');

//call localhost:5000/api/prodcateg
router.get('/', ProdCategController.show);
//call localhost:5000/api/prodcateg/store
router.post('/store', ProdCategController.store)
//call localhost:5000/api/prodcateg/update
router.post('/update', ProdCategController.update);
//call localhost:5000/api/prodcateg/delete
router.post('/delete', ProdCategController.destroy);

module.exports = router;