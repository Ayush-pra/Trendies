/**
 * AI Service — OpenRouter integration via OpenAI-compatible SDK
 * 
 * Exposes three functions:
 * - classifyIntent(message) — intent classification + filter extraction
 * - generateResponse(intent, data, userMessage) — PRODUCT_INFO / PRODUCT_RECOMMENDATION
 * - generateFashionAdvice(message) — standalone fashion advice
 * 
 * Uses OpenRouter as the AI provider with OpenAI SDK compatibility.
 * MongoDB remains the only source of product data — AI never invents products.
 */

const OpenAI = require("openai");
const INTENT_CLASSIFICATION_PROMPT = require("../prompts/intentClassification");
const {
  PRODUCT_INFO_RESPONSE_PROMPT,
  PRODUCT_RECOMMENDATION_PROMPT,
  FASHION_ADVICE_PROMPT,
} = require("../prompts/responseGeneration");

// ── Config ──────────────────────────────────────────────────────
// Change this to swap models easily (e.g., "meta-llama/llama-4-maverick", "anthropic/claude-3.5-haiku")
const AI_MODEL = "deepseek/deepseek-chat-v3-0324";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// ── Helpers ─────────────────────────────────────────────────────

/**
 * Send a chat completion request to OpenRouter.
 * Throws on failure so callers can handle SYSTEM_ERROR.
 */
const chatCompletion = async (systemPrompt, userMessage, maxTokens = 500, expectJson = false) => {
  try {
    const options = {
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1, // Lower temperature for more deterministic routing
      max_tokens: maxTokens,
    };

    if (expectJson) {
      options.response_format = { type: "json_object" };
    }

    const response = await client.chat.completions.create(options);

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error("Invalid or empty response from AI provider.");
    }

    return response.choices[0].message.content.trim();
  } catch (error) {
    // Re-throw so chatService can catch and return the fallback message
    throw new Error(error.message);
  }
};

// ── Public API ──────────────────────────────────────────────────

/**
 * Classify user intent and extract filters.
 * Returns { intent, filters } on success.
 * Throws on AI/network failure (chatService handles SYSTEM_ERROR).
 */
const classifyIntent = async (message) => {
  console.log("\n========== INTENT CLASSIFICATION ==========");
  console.log("OPENROUTER MODEL:", AI_MODEL);
  console.log("USER MESSAGE:", message);

  // Pass expectJson = true to strictly force JSON output
  const responseText = await chatCompletion(INTENT_CLASSIFICATION_PROMPT, message, 500, true);

  console.log("RAW AI RESPONSE:", responseText);

  // Strip markdown code fences if the model wraps JSON
  const cleanedText = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleanedText);

  console.log("PARSED CLASSIFICATION:", JSON.stringify(parsed, null, 2));

  // Validate intent
  const validIntents = [
    "PRODUCT_SEARCH",
    "PRODUCT_INFO",
    "PRODUCT_RECOMMENDATION",
    "FASHION_ADVICE",
    "ORDER_STATUS",
    "ORDER_HISTORY",
    "STORE_INFO",
    "OUT_OF_SCOPE",
  ];

  if (!parsed.intent || !validIntents.includes(parsed.intent)) {
    console.warn("INVALID INTENT FROM AI:", parsed.intent);
    return { intent: "OUT_OF_SCOPE", filters: {} };
  }

  console.log("FINAL INTENT:", parsed.intent);
  console.log("EXTRACTED FILTERS:", JSON.stringify(parsed.filters || {}));
  console.log("============================================\n");

  return {
    intent: parsed.intent,
    filters: parsed.filters || {},
  };
};

/**
 * Generate a natural language response from real product data.
 * Used only for PRODUCT_INFO and PRODUCT_RECOMMENDATION intents.
 * Throws on AI/network failure.
 */
const generateResponse = async (intent, products, userMessage) => {
  console.log("\n---------- RESPONSE GENERATION ----------");
  console.log("OPENROUTER MODEL:", AI_MODEL);
  console.log("INTENT:", intent, "| PRODUCTS COUNT:", products.length);

  const systemPrompt =
    intent === "PRODUCT_RECOMMENDATION"
      ? PRODUCT_RECOMMENDATION_PROMPT
      : PRODUCT_INFO_RESPONSE_PROMPT;

  const productSummary = products
    .slice(0, 10)
    .map(
      (p) =>
        `- ${p.name} (₹${p.price}, Category: ${p.category}, SubCategory: ${p.subCategory}, Sizes: ${p.sizes?.join(", ") || "N/A"})`
    )
    .join("\n");

  const prompt = `User's question: "${userMessage}"

Products found in our database (${products.length} total):
${productSummary || "No products found."}

Please respond to the user's question based on this data.`;

  const responseText = await chatCompletion(systemPrompt, prompt);

  console.log("RAW AI RESPONSE:", responseText.substring(0, 200) + "...");
  console.log("-----------------------------------------\n");

  return responseText;
};

/**
 * Generate fashion advice — standalone call, no product data.
 * Throws on AI/network failure.
 */
const generateFashionAdvice = async (message) => {
  console.log("\n---------- FASHION ADVICE ----------");
  console.log("OPENROUTER MODEL:", AI_MODEL);
  console.log("USER MESSAGE:", message);

  const responseText = await chatCompletion(FASHION_ADVICE_PROMPT, message);

  console.log("RAW AI RESPONSE:", responseText.substring(0, 200) + "...");
  console.log("------------------------------------\n");

  return responseText;
};

module.exports = { classifyIntent, generateResponse, generateFashionAdvice };
