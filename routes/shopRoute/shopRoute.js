const express = require('express');
const multer = require('multer')
const router = express.Router();
const {isSeller}=require('../../Middleware/auth')
const {create_shop,loginseller,loadSeller,getShopInfo} = require('../../Controller/shopController');


//multer..................
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = file.originalname.split(".")[0];
      cb(null, filename + "-" + uniqueSuffix + ".png");
    },
  });
  const upload = multer({ storage: storage });
// create shop
router.post("/create_shop",upload.single('file'),create_shop);
router.post("/login_shop",loginseller);
router.get('/loadseller',isSeller,loadSeller);
router.get('/get-shop-info/:id',getShopInfo)


module.exports=router;