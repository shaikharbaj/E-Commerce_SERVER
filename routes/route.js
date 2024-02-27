const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes/userRoutes.js')
const productRoutes = require('./productRoutes/productRoutes.js')
const shopRoutes = require('./shopRoute/shopRoute.js')
router.use("/user",userRoutes);
// router.use("/shop",shopRoutes);
// router.use("/product",productRoutes);

module.exports=router;