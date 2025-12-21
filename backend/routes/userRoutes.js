const express = require("express");
const isAuth = require("../middleware/authMiddleware.js");
const {getCurrentUser, getAdmin} = require("../controller/userController.js");
const adminAuth = require("../middleware/adminAuth.js");

const userRoutes = express.Router();

userRoutes.get("/getCurrentUser", isAuth, getCurrentUser);
userRoutes.get("/getCurrentAdmin", adminAuth, getAdmin);

module.exports = userRoutes;