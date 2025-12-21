const express = require("express");
const { register, login, logout, googleLogin, adminLogin } = require("../controller/authController");  

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/logout", logout);
authRoute.post("/googlelogin", googleLogin);
authRoute.post("/adminlogin", adminLogin);

module.exports = authRoute;
