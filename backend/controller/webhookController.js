const crypto = require("crypto");
const Order = require("../model/orderModel");
const User = require("../model/userModel");
const { releaseStock } = require("../services/stockService");

const razorpayWebhook = async (req, res) => {
    try {
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

        const event = req.body.event;
        const payload = req.body.payload;
        
        console.log("Raw Webhook Payload:", JSON.stringify(req.body, null, 2));
        
        const receiptId = payload.payment?.entity?.notes?.receipt || payload.order?.entity?.receipt; 
        
        // Sometimes payload.order is not present in some events, checking notes just in case,
        // but normally if we attach receipt to order creation, it comes back in payload.order.entity.receipt.
        // Let's rely on the order entity receipt if it exists.

        if (!receiptId && payload.order?.entity?.receipt) {
             // Fallback isn't needed if it's there
        }

        const actualReceiptId = payload.order?.entity?.receipt;

        if (!actualReceiptId) {
            console.log("No receipt ID found in webhook payload order entity, ignoring.");
            return res.status(200).json({ received: true });
        }

        if (event === "payment.captured") {
            const order = await Order.findById(actualReceiptId);
            
            if (order && !order.payment) {
                // Mark order as paid
                await Order.findByIdAndUpdate(actualReceiptId, { payment: true });
                await User.findByIdAndUpdate(order.userId, { cartData: {} });
                console.log(`Webhook: Order ${actualReceiptId} marked as paid`);
            } else if (order && order.payment) {
                console.log(`Webhook: Order ${actualReceiptId} was already marked as paid.`);
            } else {
                console.log(`Webhook: Order ${actualReceiptId} not found.`);
            }
        } 
        else if (event === "payment.failed") {
            const order = await Order.findById(actualReceiptId);
            
            if (order && !order.payment) {
                // Release stock back to inventory
                if (order.items && order.items.length > 0) {
                    await releaseStock(order.items);
                    console.log(`Webhook: Stock released for failed order ${actualReceiptId}`);
                }
                
                // We leave the order as payment: false in the DB.
                // Could optionally update status to "Failed", but typically it just remains unpaid.
            }
        }

        // Always respond with 200 OK so Razorpay knows we received it
        res.status(200).json({ received: true });

    } catch (error) {
        console.error("Webhook processing error:", error);
        // Still return 200 to prevent Razorpay from retrying endlessly
        res.status(200).json({ received: true });
    }
};

module.exports = { razorpayWebhook };
