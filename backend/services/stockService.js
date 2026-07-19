const Product = require("../model/productModel");

/**
 * Atomically reserve stock for a list of order items.
 * Uses findOneAndUpdate with a condition filter — MongoDB's WiredTiger engine
 * acquires an exclusive document-level lock, so only one concurrent request
 * can succeed for the last unit of stock.
 *
 * @param {Array} items - Array of { _id, size, quantity } objects
 * @returns {Object} { success, failedItem? }
 */
const reserveStock = async (items) => {
    const reservedItems = [];
    const failedItems = [];

    for (const item of items) {
        const qty = item.quantity || 1;

        // Atomic: match only if this size has enough stock, then decrement
        const product = await Product.findOneAndUpdate(
            {
                _id: item._id,
                [`sizes.${item.size}`]: { $gte: qty }
            },
            {
                $inc: { [`sizes.${item.size}`]: -qty }
            },
            { new: true }
        );

        if (!product) {
            // Stock insufficient or product not found — skip this item
            const failedProduct = await Product.findById(item._id).lean();
            failedItems.push({
                ...item,
                name: failedProduct?.name || "Unknown product",
                availableQty: failedProduct?.sizes?.get?.(item.size) ?? failedProduct?.sizes?.[item.size] ?? 0
            });
        } else {
            reservedItems.push(item);
        }
    }

    return { 
        success: reservedItems.length > 0, // Success if AT LEAST ONE item was reserved
        reservedItems,
        failedItems 
    };
};

/**
 * Release (increment back) previously reserved stock.
 * Used for rollback on partial failures or payment cancellations.
 *
 * @param {Array} items - Array of { _id, size, quantity } objects
 */
const releaseStock = async (items) => {
    for (const item of items) {
        await Product.findByIdAndUpdate(
            item._id,
            { $inc: { [`sizes.${item.size}`]: item.quantity } }
        );
    }
};

module.exports = { reserveStock, releaseStock };
