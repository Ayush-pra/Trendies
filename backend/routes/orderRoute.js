const express = require("express");
const isAuth = require("../middleware/authMiddleware");
const { PlacedOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay, verifyRazorpay} = require("../controller/orderController");
const adminAuth = require("../middleware/adminAuth");

const orderRoute = express.Router();

//for User
orderRoute.post("/placeorder", isAuth, PlacedOrder);
orderRoute.post("/razorpay", isAuth, placeOrderRazorpay);
orderRoute.post("/userorders", isAuth, userOrders);
orderRoute.post("/verifyrazorpay", isAuth, verifyRazorpay)
//for Admin
orderRoute.post("/list", adminAuth, allOrders);
orderRoute.post("/status", adminAuth, updateStatus);

module.exports = orderRoute;
