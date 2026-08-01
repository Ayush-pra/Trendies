const Order = require("../model/orderModel");
const User = require("../model/userModel");
const Razorpay = require('razorpay');
const { reserveStock, releaseStock } = require("../services/stockService");

const currency = 'inr'

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const PlacedOrder = async (req, res) => {
    try {
        const { items, address } = req.body;
        let { amount } = req.body;
        const userId = req.userId;

        // Atomically reserve stock for all items
        const stockResult = await reserveStock(items);

        if (!stockResult.success) {
            return res.status(409).json({
                message: "All items in your order are out of stock.",
                failedItems: stockResult.failedItems
            });
        }

        // Recalculate amount if some items failed
        if (stockResult.failedItems.length > 0) {
            let failedAmount = 0;
            for (const item of stockResult.failedItems) {
                failedAmount += (item.price * item.quantity);
            }
            amount -= failedAmount;
        }

        const orderData = {
            items: stockResult.reservedItems,
            amount,
            userId,
            address,
            paymentMethod: 'cod',
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        await User.findByIdAndUpdate(userId, { cartData: {} });

        let message = 'Order Placed';
        if (stockResult.failedItems.length > 0) {
            const failedNames = stockResult.failedItems.map(i => `${i.name} (Size: ${i.size})`).join(', ');
            message = `Order placed. Note: ${failedNames} were removed as they are out of stock.`;
        }

        return res.status(201).json({ message, failedItems: stockResult.failedItems })
    }
    catch (error) {
        console.error("PlacedOrder Error:", error);
        return res.status(500).json({ message: 'Order Place error' })
    }
}

const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, address } = req.body;
        let { amount } = req.body;
        const userId = req.userId;

        // Atomically reserve stock for all items
        const stockResult = await reserveStock(items);

        if (!stockResult.success) {
            return res.status(409).json({
                message: "All items in your order are out of stock.",
                failedItems: stockResult.failedItems
            });
        }

        // Recalculate amount if some items failed
        if (stockResult.failedItems.length > 0) {
            let failedAmount = 0;
            for (const item of stockResult.failedItems) {
                failedAmount += (item.price * item.quantity);
            }
            amount -= failedAmount;
        }

        const orderData = {
            items: stockResult.reservedItems,
            amount,
            userId,
            address,
            paymentMethod: 'Razorpay',
            payment: false,
            status: 'Pending Payment',
            date: Date.now()
        }
        const newOrder = new Order(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.error("placeOrderRazorpay callback Error:", error);
                // Release stock since Razorpay order creation failed
                releaseStock(stockResult.reservedItems);
                return res.status(500).json(error);
            }
            // Send back failedItems so frontend can show the message BEFORE Razorpay opens, or along with it
            res.status(200).json({ ...order, failedItems: stockResult.failedItems });
        })
    }
    catch (error) {
        console.error("placeOrderRazorpay Error:", error);
        res.status(500).json({ message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true, status: 'Orderd Placed' })
            await User.findByIdAndUpdate(userId, { cartData: {} })
            res.status(200).json({ message: 'Payment Successful' })
        }
        else {
            // Payment failed — release the reserved stock
            const order = await Order.findById(orderInfo.receipt);
            if (order && order.items) {
                await releaseStock(order.items);
            }
            res.json({ message: 'Payment Failed' })
        }
    }
    catch (error) {
        console.error("verifyRazorpay Error:", error);
        res.status(500).json({ message: error.message })
    }
}

const userOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId });
        return res.status(200).json(orders);
    }
    catch (error) {
        console.error("userOrders Error:", error);
        return res.status(500).json({ message: 'userOrder error' })
    }
}

//for Admin

const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("allOrders Error:", error);
        return res.status(500).json({ message: 'AdminOrder error' })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const updateData = { status };

        // For COD orders: when admin marks as "Delivered", the customer has paid cash
        // so automatically set payment to true
        if (status === 'Delivered') {
            const order = await Order.findById(orderId);
            if (order && order.paymentMethod === 'cod' && !order.payment) {
                updateData.payment = true;
            }
        }

        await Order.findByIdAndUpdate(orderId, updateData);
        return res.status(201).json({ message: "Status Updated" });
    }
    catch (error) {
        console.error("updateStatus Error:", error);
        return res.status(500).json({ message: 'updateStatus error' })
    }
}

const cancelRazorpayOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({ message: "Missing razorpay_order_id" });
        }

        // Fetch the Razorpay order to get our MongoDB order ID (receipt)
        const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
        const mongoOrderId = razorpayOrder.receipt;

        if (!mongoOrderId) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = await Order.findById(mongoOrderId);

        // Only cancel if the order belongs to this user, is unpaid, and still pending
        if (order && order.userId === userId && !order.payment && order.status === 'Pending Payment') {
            // Release the reserved stock back to inventory
            if (order.items && order.items.length > 0) {
                await releaseStock(order.items);
            }
            await Order.findByIdAndUpdate(mongoOrderId, { status: 'Cancelled' });
            console.log(`Order ${mongoOrderId} cancelled — user closed Razorpay modal`);
            return res.status(200).json({ message: "Order cancelled" });
        }

        return res.status(200).json({ message: "No action needed" });
    }
    catch (error) {
        console.error("cancelRazorpayOrder Error:", error);
        return res.status(500).json({ message: "Cancel order error" });
    }
}

module.exports = { PlacedOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay, verifyRazorpay, cancelRazorpayOrder };


