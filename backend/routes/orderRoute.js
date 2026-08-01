const express = require("express");
const isAuth = require("../middleware/authMiddleware");
const idempotencyMiddleware = require("../middleware/idempotencyMiddleware");
const { PlacedOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay, verifyRazorpay, cancelRazorpayOrder} = require("../controller/orderController");
const adminAuth = require("../middleware/adminAuth");

const orderRoute = express.Router();

//for User
orderRoute.post("/placeorder", isAuth, idempotencyMiddleware, PlacedOrder);
orderRoute.post("/razorpay", isAuth, idempotencyMiddleware, placeOrderRazorpay);
orderRoute.post("/userorders", isAuth, userOrders);
orderRoute.post("/verifyrazorpay", isAuth, verifyRazorpay)
orderRoute.post("/cancelrazorpay", isAuth, cancelRazorpayOrder)
//for Admin
orderRoute.post("/list", adminAuth, allOrders);
orderRoute.post("/status", adminAuth, updateStatus);

module.exports = orderRoute;
