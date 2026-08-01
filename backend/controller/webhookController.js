const crypto = require("crypto");
const Razorpay = require('razorpay');
const Order = require("../model/orderModel");
const User = require("../model/userModel");
const { releaseStock } = require("../services/stockService");

// We need a Razorpay instance to fetch order details using the order_id
// because the webhook payload does NOT include the receipt (our MongoDB Order _id) directly.
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const razorpayWebhook = async (req, res) => {
    try {
        // ============ STEP 1: Verify the HMAC Signature ============
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("Webhook secret not configured in .env");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const signature = req.headers["x-razorpay-signature"];
        
        if (!signature) {
             return res.status(400).json({ message: "No signature provided" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("Webhook signature mismatch — rejecting request");
            return res.status(400).json({ message: "Invalid signature" });
        }

        // ============ STEP 2: Extract the event and payload ============
        const event = req.body.event;
        const payload = req.body.payload;

        // ============ STEP 3: Get the MongoDB Order _id (receipt) ============
        // The webhook payload for payment.captured looks like this:
        // { payload: { payment: { entity: { order_id: "order_ABC123" } } } }
        // Notice: there is NO "order" object in the payload, so we CANNOT do payload.order.entity.receipt.
        // Instead, we grab the Razorpay order_id from the payment entity,
        // then use the Razorpay SDK to fetch the full order which contains our receipt (MongoDB _id).

        const razorpayOrderId = payload.payment?.entity?.order_id;

        if (!razorpayOrderId) {
            console.log("No order_id found in webhook payment entity, ignoring.");
            return res.status(200).json({ received: true });
        }

        // Fetch the full Razorpay order to get the receipt (our MongoDB Order _id)
        const razorpayOrder = await razorpayInstance.orders.fetch(razorpayOrderId);
        const mongoOrderId = razorpayOrder.receipt; // This is the MongoDB Order _id we passed during order creation

        if (!mongoOrderId) {
            console.log("No receipt (MongoDB _id) found in Razorpay order, ignoring.");
            return res.status(200).json({ received: true });
        }

        console.log(`Webhook: Razorpay order ${razorpayOrderId} → MongoDB order ${mongoOrderId}`);

        // ============ STEP 4: Handle the event ============
        if (event === "payment.captured") {
            const order = await Order.findById(mongoOrderId);
            
            if (order && !order.payment) {
                // Mark order as paid and clear the user's cart
                await Order.findByIdAndUpdate(mongoOrderId, { payment: true });
                await User.findByIdAndUpdate(order.userId, { cartData: {} });
                console.log(`Webhook: Order ${mongoOrderId} marked as paid ✅`);
            } else if (order && order.payment) {
                console.log(`Webhook: Order ${mongoOrderId} was already marked as paid (idempotent skip).`);
            } else {
                console.log(`Webhook: Order ${mongoOrderId} not found in database.`);
            }
        } 
        else if (event === "payment.failed") {
            const order = await Order.findById(mongoOrderId);
            
            if (order && !order.payment) {
                // Release stock back to inventory since payment failed
                if (order.items && order.items.length > 0) {
                    await releaseStock(order.items);
                }

                // Update order status so the user sees a clear "Payment Failed" on their Orders page
                await Order.findByIdAndUpdate(mongoOrderId, { status: "Payment Failed" });
                console.log(`Webhook: Order ${mongoOrderId} marked as Payment Failed, stock released`);
            }
        }

        // ============ STEP 5: Always respond 200 OK ============
        res.status(200).json({ received: true });

    } catch (error) {
        console.error("Webhook processing error:", error);
        // Still return 200 to prevent Razorpay from retrying endlessly
        res.status(200).json({ received: true });
    }
};

module.exports = { razorpayWebhook };
