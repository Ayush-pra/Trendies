/**
 * Optional Auth Middleware
 * 
 * Unlike authMiddleware.js (which rejects unauthenticated requests),
 * this middleware:
 * - If token exists → verifies and sets req.userId
 * - If no token → sets req.userId = null and continues
 * 
 * Used for the chat endpoint where auth is optional:
 * product search works without login, order queries need auth.
 */

const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      req.userId = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // Token exists but is invalid/expired — treat as unauthenticated
    req.userId = null;
    next();
  }
};

module.exports = optionalAuth;
