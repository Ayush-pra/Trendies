const mongoose = require("mongoose");

// Wishlist schema — separate collection per requirements
// Each document represents one user-product wishlist entry
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
}, { timestamps: true });

// Compound unique index prevents duplicate wishlist entries
// for the same user and product combination
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
