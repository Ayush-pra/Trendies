const express = require("express");
const isAuth = require("../middleware/authMiddleware");
const { toggleWishlist, getWishlist } = require("../controller/wishlistController");

const wishlistRoute = express.Router();

// All wishlist routes require authentication
wishlistRoute.post("/toggle", isAuth, toggleWishlist);
wishlistRoute.get("/", isAuth, getWishlist);

module.exports = wishlistRoute;
