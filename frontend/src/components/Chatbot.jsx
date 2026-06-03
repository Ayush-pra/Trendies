import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import "./Chatbot.css";

const SUGGESTION_CHIPS = [
  "Show bestsellers",
  "Men's winter wear",
  "Track my order",
  "Fashion advice",
  "Return policy",
  "Suggest outfits for college",
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        serverUrl + "/api/chat",
        { message: userMessage },
        { withCredentials: true }
      );

      const data = response.data;

      // Build AI message object
      const aiMsg = {
        role: "ai",
        content: data.message || "I'm not sure how to help with that.",
        intent: data.intent,
        products: data.products || [],
        order: data.order || null,
        orders: data.orders || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment. 🙏",
          intent: null,
          products: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChipClick = (chip) => {
    sendMessage(chip);
  };

  const handleProductClick = (productId) => {
    navigate(`/productdetail/${productId}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="chatbot-fab"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            aria-label="Open chat assistant"
            id="chatbot-fab"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            id="chatbot-panel"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <div className="chatbot-avatar">👗</div>
                <div className="chatbot-header-info">
                  <h3>Trendies Assistant</h3>
                  <span>AI-powered fashion help</span>
                </div>
              </div>
              <button
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                id="chatbot-close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages" id="chatbot-messages">
              {/* Welcome */}
              {messages.length === 0 && (
                <div className="chatbot-welcome">
                  <div className="chatbot-welcome-icon">✨</div>
                  <h4>Welcome to Trendies!</h4>
                  <p>
                    I can help you find products, give fashion advice, track orders, and more.
                  </p>
                </div>
              )}

              {/* Suggestion chips — show only if no messages yet */}
              {messages.length === 0 && (
                <div className="chatbot-chips">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      className="chatbot-chip"
                      onClick={() => handleChipClick(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Message list */}
              {messages.map((msg, idx) => (
                <React.Fragment key={idx}>
                  {/* Message bubble */}
                  <motion.div
                    className={`chatbot-msg ${
                      msg.role === "user" 
                        ? "chatbot-msg-user" 
                        : msg.intent === "SYSTEM_ERROR"
                        ? "chatbot-msg-error"
                        : "chatbot-msg-ai"
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {msg.content}
                  </motion.div>

                  {/* Product cards */}
                  {msg.role === "ai" &&
                    msg.products &&
                    msg.products.length > 0 && (
                      <motion.div
                        className="chatbot-products-wrapper"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.1 }}
                      >
                        <div className="chatbot-products-label">Matching Products ({msg.products.length})</div>
                        <div className="chatbot-products">
                          {msg.products.map((product) => (
                            <div
                              key={product._id}
                              className="chatbot-product-card"
                              onClick={() => handleProductClick(product._id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleProductClick(product._id)
                              }
                            >
                              <div className="chatbot-product-img-wrapper">
                                <img
                                  src={product.image1}
                                  alt={product.name}
                                  className="chatbot-product-img"
                                  loading="lazy"
                                />
                              </div>
                              <div className="chatbot-product-info">
                                <p className="chatbot-product-name">{product.name}</p>
                                <p className="chatbot-product-price">₹{product.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                </React.Fragment>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="chatbot-typing">
                  <div className="chatbot-typing-dot" />
                  <div className="chatbot-typing-dot" />
                  <div className="chatbot-typing-dot" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                placeholder="Ask about fashion, products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                maxLength={500}
                id="chatbot-input"
              />
              <button
                className="chatbot-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                id="chatbot-send"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
