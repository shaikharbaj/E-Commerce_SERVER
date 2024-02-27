const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../Model/UserModel.js");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail.js");
const catchAsyncError = require("../Middleware/catchAsyncError.js");

const createUser = catchAsyncError(async (req, res, next) => {
  const { email, name, password } = req.body;
  //check user already exist....
  const checkuser = await User.findOne({ email });
  if (checkuser) {
    const filename = req.file.filename;

    const filepath = `uploads/${filename}`;
    await fs.unlink(filepath, (err) => {
      if (err) {
        console.log("Error While Deleting file");
      } else {
        console.log("file deleted successfully");
      }
    });
    return next(new ErrorHandler("user already exist", 400));
  }
  const filename = req.file.filename;
  const fileUrl = path.join(filename);

  //create encrypt password............
  const hashpassword = await bcrypt.hash(password, 10);

  const user = {
    name: name,
    email: email,
    password: hashpassword,
    avatar: fileUrl,
  };

  //save to database......
  const newUser = await User.create(user);

  //create jwt token.................
  // const token = await jwt.sign(user, process.env.JWT_SECRET, {
  //   expiresIn: "5m",
  // });

  return res.status(201).json({
    success: true,
    message: "user register successfully.",
  });
});

const loginuser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //check user with exist or not
  const checkuserexist = await User.findOne({ email }).select("+password");
  if (!checkuserexist) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  //check password............
  const matchpassword = await bcrypt.compare(password, checkuserexist.password);
  if (!matchpassword) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // generate jwt token...........

  const token = await jwt.sign(
    { userId: checkuserexist._id },
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
  const userData = checkuserexist.toObject();
  delete userData.password;

  return res.status(201).cookie("token", token, options).json({
    success: true,
    message: "logged in successfully",
    userData,
  });
});

// router.post("/send_mail", async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// });

//load user.....
const loadUser = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(201).json({
    success: true,
    message: "Log out successful!",
  });
});

module.exports = { createUser, loginuser, loadUser, logout };
