/**
 * Chat Service — The Orchestrator
 * 
 * Single entry point: processMessage(userMessage, userId?)
 * 
 * Flow:
 * 1. Classify intent + extract filters (single Gemini call)
 * 2. Dispatch to the correct service handler
 * 3. Return structured response
 * 
 * V1: No conversational memory — each message is independent.
 */

const { classifyIntent, generateResponse, generateFashionAdvice } = require("./aiService");
const { searchProducts } = require("./productSearchService");
const { getProductInfo } = require("./productInfoService");
const { getOrderStatus, getOrderHistory } = require("./orderQueryService");
const { getStoreInfo } = require("./storeInfoService");

const OUT_OF_SCOPE_MESSAGE =
  "I'm the fashion assistant for Trendies. I can help you with products, clothing advice, shopping assistance, and orders. Feel free to ask me anything about fashion! 👗";

/**
 * Process a user message and return a structured response.
 * 
 * @param {string} userMessage - The user's chat message
 * @param {string|null} userId - The authenticated user's ID (null if not logged in)
 * @returns {object} - { success, intent, message, products?, order?, orders? }
 */
const processMessage = async (userMessage, userId = null) => {
  try {
    // Validate input
    if (!userMessage || typeof userMessage !== "string" || userMessage.trim().length === 0) {
      return {
        success: false,
        intent: null,
        message: "Please type a message so I can help you! 😊",
      };
    }

    const trimmedMessage = userMessage.trim();

    // Step 1: Classify intent + extract filters (single AI call via OpenRouter)
    const { intent, filters } = await classifyIntent(trimmedMessage);

    console.log("ROUTED HANDLER:", intent);

    // Step 2: Dispatch to handler based on intent
    switch (intent) {
      case "PRODUCT_SEARCH": {
        console.log("SEARCH FILTERS:", JSON.stringify(filters));
        const result = await searchProducts(filters);
        return {
          success: true,
          intent: "PRODUCT_SEARCH",
          message: result.message,
          products: result.products,
        };
      }

      case "PRODUCT_INFO": {
        const result = await getProductInfo(filters, trimmedMessage);
        return {
          success: true,
          intent: "PRODUCT_INFO",
          message: result.message,
          products: result.products,
        };
      }

      case "PRODUCT_RECOMMENDATION": {
        // Search for products using filters
        const searchResult = await searchProducts(filters);

        // Generate personalized recommendation with second AI call
        const aiMessage = await generateResponse(
          "PRODUCT_RECOMMENDATION",
          searchResult.products,
          trimmedMessage
        );

        return {
          success: true,
          intent: "PRODUCT_RECOMMENDATION",
          message: aiMessage,
          products: searchResult.products,
        };
      }

      case "FASHION_ADVICE": {
        const advice = await generateFashionAdvice(trimmedMessage);
        return {
          success: true,
          intent: "FASHION_ADVICE",
          message: advice,
        };
      }

      case "ORDER_STATUS": {
        const result = await getOrderStatus(userId);
        return {
          success: true,
          intent: "ORDER_STATUS",
          message: result.message,
          order: result.order,
        };
      }

      case "ORDER_HISTORY": {
        const result = await getOrderHistory(userId);
        return {
          success: true,
          intent: "ORDER_HISTORY",
          message: result.message,
          orders: result.orders,
        };
      }

      case "STORE_INFO": {
        const result = getStoreInfo(trimmedMessage);
        return {
          success: true,
          intent: "STORE_INFO",
          message: result.message,
        };
      }

      case "OUT_OF_SCOPE":
      default: {
        return {
          success: true,
          intent: "OUT_OF_SCOPE",
          message: OUT_OF_SCOPE_MESSAGE,
        };
      }
    }
  } catch (error) {
    console.error("chatService SYSTEM_ERROR:", error.message, error.status);

    return {
      success: false,
      intent: "SYSTEM_ERROR",
      message: "The AI assistant is temporarily unavailable. Please try again later.",
    };
  }
};

module.exports = { processMessage };
