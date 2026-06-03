/**
 * Product Search Service
 * 
 * Converts AI-extracted filters into MongoDB queries.
 * Searches both name AND description fields for searchTerm.
 * Used by PRODUCT_SEARCH and PRODUCT_RECOMMENDATION intents.
 * Response message is built programmatically (no second Gemini call for PRODUCT_SEARCH).
 */

const Product = require("../model/productModel");

/**
 * Build MongoDB query from AI-extracted filters
 */
const buildQuery = (filters) => {
  const query = {};

  if (filters.category) {
    query.category = { $regex: new RegExp(filters.category, "i") };
  }

  if (filters.subCategory) {
    query.subCategory = { $regex: new RegExp(filters.subCategory, "i") };
  }

  if (filters.maxPrice || filters.minPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  if (filters.bestseller === true) {
    query.bestseller = true;
  }

  // Search both name and description for the search term
  if (filters.searchTerm) {
    const searchRegex = new RegExp(filters.searchTerm, "i");
    query.$or = [
      { name: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
    ];
  }

  return query;
};

/**
 * Search products using filters extracted by AI.
 * Returns { products, message }
 */
const searchProducts = async (filters) => {
  try {
    const query = buildQuery(filters);

    const products = await Product.find(query)
      .select("name price image1 category subCategory sizes bestseller description")
      .sort({ date: -1 })
      .limit(20)
      .lean();

    // Programmatic response message — no second Gemini call
    let message;
    if (products.length === 0) {
      message = "I couldn't find any products matching your search. Try different keywords or browse our collections! 🔍";
    } else if (products.length === 1) {
      message = "I found 1 product that matches your search! 🛍️";
    } else {
      message = `Here are ${products.length} products I found for you! 🛍️`;
    }

    return { products, message };
  } catch (error) {
    console.error("productSearchService error:", error.message);
    return {
      products: [],
      message: "Sorry, I had trouble searching for products. Please try again.",
    };
  }
};

module.exports = { searchProducts, buildQuery };
