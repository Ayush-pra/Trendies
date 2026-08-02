/**
 * Order Query Service
 * 
 * Handles ORDER_STATUS and ORDER_HISTORY intents.
 * Response messages are built programmatically — no second Gemini call.
 * Requires userId for order lookups.
 */

const Order = require("../model/orderModel");

/**
 * Get the latest order status for a user.
 * Returns { message, order }
 */
const getOrderStatus = async (userId) => {
  if (!userId) {
    return {
      message: "Please log in to check your order status. 🔐",
      order: null,
    };
  }

  try {
    const latestOrder = await Order.findOne({ userId })
      .sort({ date: -1 })
      .lean();

    if (!latestOrder) {
      return {
        message: "You don't have any orders yet. Start shopping! 🛒",
        order: null,
      };
    }

    const orderDate = new Date(latestOrder.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const itemsList = latestOrder.items && Array.isArray(latestOrder.items)
      ? latestOrder.items.map(i => i.name || "Item").join(", ")
      : "your items";

    let statusText = latestOrder.status;
    // Resolve contradictory DB state if it says pending but payment is true
    if (statusText === "Pending Payment" && latestOrder.payment) {
        statusText = "Processing"; 
    }

    const paymentText = latestOrder.payment ? "Payment is confirmed. ✅" : "Payment is pending. ⏳";

    const message = `Your recent order containing "${itemsList}" (₹${latestOrder.amount}) placed on ${orderDate} is currently: ${statusText}. ${paymentText}`;

    return { message, order: latestOrder };
  } catch (error) {
    console.error("orderQueryService getOrderStatus error:", error.message);
    return {
      message: "Sorry, I had trouble fetching your order status. Please try again.",
      order: null,
    };
  }
};

/**
 * Get recent order history for a user (last 5 orders).
 * Returns { message, orders }
 */
const getOrderHistory = async (userId) => {
  if (!userId) {
    return {
      message: "Please log in to view your order history. 🔐",
      orders: [],
    };
  }

  try {
    const orders = await Order.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    if (orders.length === 0) {
      return {
        message: "You don't have any orders yet. Start shopping! 🛒",
        orders: [],
      };
    }

    const orderSummary = orders
      .map((o, i) => {
        const date = new Date(o.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });
        
        const itemsList = o.items && Array.isArray(o.items)
          ? o.items.map(item => item.name || "Item").join(", ")
          : "Items";
          
        return `${i + 1}. ${itemsList}\n   ₹${o.amount} — ${o.status} (${date})`;
      })
      .join("\n\n");

    const message = `Here are your recent orders:\n\n${orderSummary}`;

    return { message, orders };
  } catch (error) {
    console.error("orderQueryService getOrderHistory error:", error.message);
    return {
      message: "Sorry, I had trouble fetching your orders. Please try again.",
      orders: [],
    };
  }
};

module.exports = { getOrderStatus, getOrderHistory };
