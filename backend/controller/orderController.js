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
            await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            await User.findByIdAndUpdate(userId, { cartData: {} })
            res.status(200).json({ message: 'Payment Successful' })
        }
        else{
            // Payment failed — release the reserved stock
            const order = await Order.findById(orderInfo.receipt);
            if (order && order.items) {
                await releaseStock(order.items);
            }
            res.json({message:'Payment Failed'})
        }
    }
    catch(error) {
        console.error("verifyRazorpay Error:", error);
        res.status(500).json({message:error.message})
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
        await Order.findByIdAndUpdate(orderId, { status });
        return res.status(201).json({ message: "Status Updated" });
    }
    catch (error) {
        console.error("updateStatus Error:", error);
        return res.status(500).json({ message: 'updateStatus error' })
    }
}

module.exports = { PlacedOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay , verifyRazorpay };


