/**
 * Chat Controller
 * 
 * Thin controller — validates input, calls chatService, returns JSON.
 * No business logic lives here.
 */

const { processMessage } = require("../services/chatService");

const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Input validation
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        intent: null,
        message: "Message is required and must be a string.",
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        intent: null,
        message: "Message cannot be empty.",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        intent: null,
        message: "Message is too long. Please keep it under 500 characters.",
      });
    }

    // userId is set by optionalAuth middleware (null if not logged in)
    const userId = req.userId || null;

    const response = await processMessage(message, userId);

    return res.status(response.success ? 200 : 500).json(response);
  } catch (error) {
    console.error("chatController error:", error.message);
    return res.status(500).json({
      success: false,
      intent: null,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = { handleChatMessage };
