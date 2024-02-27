const catchAsyncError = require("../Middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../Model/ShopModel.js");
const Product = require("../Model/ProductModel.js");
const util = require("util");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary.js");
const unlinkAsync = util.promisify(fs.unlink);

const createProduct = catchAsyncError(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid!", 400));
    } else {
      let files = req.files;
      const imagesLinks = [];

      for (let i = 0; i < files.length; i++) {
        const result = await cloudinary.uploader.upload(files[i].path, {
          folder: "products",
        });

        await unlinkAsync(files[i].path);
        console.log("File deleted successfully");
        // Check if 'secure_url' exists in the Cloudinary response
        if (result.secure_url) {
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        } else {
          return next(
            new ErrorHandler("Error uploading image to Cloudinary", 500)
          );
        }
      }
      const productData = req.body;
      productData.images = imagesLinks;
      productData.shop = shop;
      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 400));
  }
});

const getAllShopProduct = catchAsyncError(async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });
    return res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const deleteShopProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id });

  if (!product) {
    return next(new ErrorHandler("Product is not found with this id", 400));
  }

  // Delete the images
  const deletionPromises = product.images.map(async (image) => {
    const filename = image.url;
    const filepath = `uploads/${filename}`;

    try {
      await unlinkAsync(filepath);
      console.log("File deleted successfully");
    } catch (err) {
      console.error("Error while deleting file:", err.message);
      // Handle or accumulate errors as needed
    }
  });

  await Promise.all(deletionPromises);

  return res.status(201).json({
    success: true,
    message: "Product deleted successfully",
  });
});

const getAllProducts=catchAsyncError(async(req,res,next)=>{
        const products = await Product.find();
        return res.status(201).json({
          success: true,
          products: products,
        })
})

module.exports = { createProduct, getAllShopProduct, deleteShopProduct ,getAllProducts};
