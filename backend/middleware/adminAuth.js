const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"Not Authorized"});
        }
        const verifytoken = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifytoken){
            return res.status(400).json({message:"Not Authorized, invalid token"});
        }
        req.adminEmail = process.env.ADMIN_EMAIL;
        next();
    }
    catch (error) {
        console.error("authentication error admin:", error);
        return res.status(500).json({ message: "Admin authorization error" });
    }
}

module.exports = adminAuth;