const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("./catchAsyncError.js");
const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("please logged in first", 401));
  }
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedToken.userId;
  next();
});
const isSeller = catchAsyncError(async(req,res,next) => {
  const {seller_token} = req.cookies;
  if(!seller_token){
      return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET);
  console.log(decoded);
  req.seller = decoded.sellerId;

  next();
});
module.exports = {isAuthenticated,isSeller};
