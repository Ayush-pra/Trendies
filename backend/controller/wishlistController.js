const mongoose = require("mongoose");
const Wishlist = require("../model/wishlistModel");

// Toggle wishlist — add if not present, remove if present
const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        // Check if already wishlisted
        const existing = await Wishlist.findOne({ userId, productId });

        if (existing) {
            // Remove from wishlist
            await Wishlist.findByIdAndDelete(existing._id);
            return res.status(200).json({ wishlisted: false, message: "Removed from wishlist" });
        } else {
            // Add to wishlist
            await Wishlist.create({ userId, productId });
            return res.status(201).json({ wishlisted: true, message: "Added to wishlist" });
        }
    } catch (error) {
        console.error("toggleWishlist Error:", error);
        return res.status(500).json({ message: "Toggle wishlist error" });
    }
};

// Get all wishlisted product IDs for the current user
const getWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const wishlistItems = await Wishlist.find({ userId }).select("productId -_id");
        const productIds = wishlistItems.map(item => item.productId);

        return res.status(200).json({ productIds });
    } catch (error) {
        console.error("getWishlist Error:", error);
        return res.status(500).json({ message: "Get wishlist error" });
    }
};

module.exports = { toggleWishlist, getWishlist };
