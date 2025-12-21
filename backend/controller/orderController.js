const Order = require("../model/orderModel");
const User = require("../model/userModel");
const Razorpay = require('razorpay');

const currency = 'inr'

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const PlacedOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;
        const orderData = {
            items,
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
        return res.status(201).json({ message: 'Order Place' })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Order Place error' })
    }
}

const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;
        const orderData = {
            items,
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
                console.log(error);
                return res.status(500).json(error);
            }
            res.status(200).json(order);
        })
    }
    catch (error) {
        console.log(error);
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
            res.json({message:'Payment Failed'})
        }
    }
    catch(error) {
        console.log(error)
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        return res.status(500).json({ message: 'updateStatus error' })
    }
}

module.exports = { PlacedOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay , verifyRazorpay };

