const express = require('express');
const router = express.Router();
const multer = require('multer');
const {createUser,loginuser,loadUser, logout} = require('../../Controller/UserController.js')
const {isAuthenticated} = require('../../Middleware/auth.js')
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


router.post("/create_user",upload.single('file'),createUser);
router.post("/login_user",loginuser);
router.get('/loaduser',isAuthenticated,loadUser);
router.get('/logout',logout);

module.exports = router;