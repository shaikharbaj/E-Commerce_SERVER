const express = require('express');
const router = express.Router();
const multer = require('multer');
const {createUser,loginuser,loadUser, logout} = require('../../Controller/UserController.js')
const {isAuthenticated} = require('../../Middleware/auth.js')
const upload = require('../../multer.js');
router.post("/create_user",upload.single('file'),createUser);
router.post("/login_user",loginuser);
router.get('/loaduser',isAuthenticated,loadUser);
router.get('/logout',logout);

module.exports = router;