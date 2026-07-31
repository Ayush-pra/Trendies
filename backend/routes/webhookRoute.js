const express = require("express");
const { razorpayWebhook } = require("../controller/webhookController");

const webhookRoute = express.Router();

// Webhook endpoints must not have authentication middleware, 
// as Razorpay servers do not have access to user JWTs.
// Security is handled by HMAC signature verification in the controller.
webhookRoute.post("/razorpay", razorpayWebhook);

module.exports = webhookRoute;
