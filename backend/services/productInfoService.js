/**
 * Product Info Service
 * 
 * Handles PRODUCT_INFO intent — when users ask informational questions
 * about products (sizes, materials, features, comparisons).
 * 
 * Queries MongoDB for relevant products, then passes data to Gemini
 * for a natural language answer (second AI call).
 */

const Product = require("../model/productModel");
const { generateResponse } = require("./aiService");

/**
 * Handle product info queries.
 * Fetches relevant products, then uses Gemini to generate a response.
 */
const getProductInfo = async (filters, userMessage) => {
  try {
    // Build a flexible query to find relevant products
    const query = {};

    if (filters.category) {
      query.category = { $regex: new RegExp(filters.category, "i") };
    }

    if (filters.subCategory) {
      query.subCategory = { $regex: new RegExp(filters.subCategory, "i") };
    }

    if (filters.searchTerm) {
      const searchRegex = new RegExp(filters.searchTerm, "i");
      query.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    const products = await Product.find(query)
      .select("name price description category subCategory sizes bestseller")
      .limit(10)
      .lean();

    // Use Gemini to generate a response based on real product data
    const message = await generateResponse("PRODUCT_INFO", products, userMessage);

    return { products: [], message };
  } catch (error) {
    console.error("productInfoService error:", error.message);
    return {
      products: [],
      message: "Sorry, I had trouble finding product information. Please try again.",
    };
  }
};

module.exports = { getProductInfo };
