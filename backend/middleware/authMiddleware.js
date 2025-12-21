const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token; // ✅ extract only "token"
    if (!token) {
      return res.status(400).json({ message: "User not found" });
    }

    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenVerify) {
      return res.status(400).json({ message: "Invalid token" });
    }

    req.userId = tokenVerify.userId; // ✅ attach userId to request
    next();
  } catch (error) {
    console.log("isAuth Error:", error.message);
    return res.status(500).json({ message: "Auth middleware error" });
  }
};

module.exports = isAuth;
