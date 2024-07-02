const path = require('path');


const express = require('express');

const productController = require('../Controllers/products')

const router = express.Router();

router.get('/', productController.getShowProducts );

module.exports = router;
