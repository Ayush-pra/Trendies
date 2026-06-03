/**
 * Chat Route
 * 
 * POST /api/chat — Single endpoint for the AI fashion assistant.
 * Uses optionalAuth so both logged-in and guest users can chat.
 */

const express = require("express");
const router = express.Router();
const optionalAuth = require("../middleware/optionalAuth");
const { handleChatMessage } = require("../controller/chatController");

router.post("/", optionalAuth, handleChatMessage);

module.exports = router;
