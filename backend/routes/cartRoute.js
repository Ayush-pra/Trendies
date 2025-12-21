const express = require("express");
const isAuth = require("../middleware/authMiddleware");
const { getUserCart, addToCart, updateCart } = require("../controller/cartController");

const cartRoute = express.Router();

cartRoute.post("/get", isAuth, getUserCart);
cartRoute.post("/add", isAuth, addToCart);
cartRoute.post("/update", isAuth, updateCart);

module.exports=cartRoute;