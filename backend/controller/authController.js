const { genToken, genTokenAdmin } = require("../config/token.js");
const User = require("../model/userModel.js");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User Already Exist. Please Sign in" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter Valid Email" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Enter Atleast 6 characters" })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword
        })
        const token = await genToken(user._id);
        res.cookie("token", token);
        return res.status(201).json(user)
    }
    catch (error) {
        console.log("Sign up error");
        res.status(500).json({ message: `Sign up error : ${error}` });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Incorrect email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Incorrect email or password" });
        }
        const token = await genToken(user._id);
        res.cookie("token", token);
        return res.status(201).json(user)
    }
    catch (error) {
        console.log("Sign in error");
        res.status(500).json({ message: `Sign in error : ${error}` });
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Visit Again" })
    }
    catch (error) {
        console.log("Sign out error");
        res.status(500).json({ message: `Sign out error : ${error}` });
    }
}

const googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email })
        }
        const token = await genToken(user._id);
        res.cookie("token", token);
        return res.status(201).json(user)
    }
    catch (error) {
        console.log("Google Sign in error");
        res.status(500).json({ message: `Google Sign in error : ${error}` });
    }

}

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await genTokenAdmin(email);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,        // true in production (HTTPS)
        sameSite: "lax",   
      });

      return res.status(201).json({ message: "Login successful" });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.log("Admin Sign in error", error);
    res.status(500).json({ message: `Admin Sign in error : ${error}` });
  }
};


module.exports = { register, login, logout, googleLogin, adminLogin };
