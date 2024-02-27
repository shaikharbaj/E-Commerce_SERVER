const express = require('express');
const { createProduct,getAllShopProduct,deleteShopProduct,getAllProducts } = require('../../Controller/productController');
const router = express.Router();
const upload = require('../../multer.js');

router.post('/create_product',upload.array("images"),createProduct);
router.get('/get-all-products-shop/:id',getAllShopProduct)
router.delete('/delete-shop-product/:id',deleteShopProduct)
router.get('/get-all-products',getAllProducts);
module.exports = router;