const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail.js");
const catchAsyncError = require("../Middleware/catchAsyncError.js");
const Shop = require("../Model/ShopModel.js");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

//create shop....
const create_shop = catchAsyncError(async (req, res, next) => {
  const { email, name, password, phonenumber, address, zipcode } = req.body;
  console.log(req.body);
  //check user already exist....
  const checkseller = await Shop.findOne({ email });
  if (checkseller) {
    const filename = req.file.filename;

    const filepath = `uploads/${filename}`;
    await fs.unlink(filepath, (err) => {
      if (err) {
        console.log("Error While Deleting file");
      } else {
        console.log("file deleted successfully");
      }
    });
    return next(new ErrorHandler("seller already exist", 400));
  }
  const filename = req.file.filename;
  const fileUrl = path.join(filename);

  //create encrypt password............
  // const hashpassword = await bcrypt.hash(password, 10);

  const seller = {
    name: name,
    email: email,
    password: password,
    avatar: fileUrl,
    address: address,
    phoneNumber: Number(phonenumber),
    zipCode: zipcode,
  };

  //save to database......
  const newSeller = await Shop.create(seller);
  return res.status(201).json({
    success: true,
    message: "seller created successfully.",
  });
});

//login seller..........

const loginseller = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //check user with exist or not
  const checksellerexist = await Shop.findOne({ email }).select("+password");
  if (!checksellerexist) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  //check password............
  const matchpassword = await bcrypt.compare(
    password,
    checksellerexist.password
  );
  if (!matchpassword) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // generate jwt token...........

  const token = await jwt.sign(
    { sellerId: checksellerexist._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  const options = {
    maxAge: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  const sellerData = checksellerexist.toObject();
  delete sellerData.password;

  return res.status(201).cookie("seller_token", token, options).json({
    success: true,
    message: "logged in successfully",
    sellerData,
  });
});

const loadSeller = catchAsyncError(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller);
    if (!seller) {
      return next(new ErrorHandler("Seller doesn't exists", 400));
    }
    return res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getShopInfo = catchAsyncError(async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = { create_shop, loginseller, loadSeller, getShopInfo };
