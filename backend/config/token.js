const jwt = require("jsonwebtoken");

const genToken = async (userId)=>{
    try{
        const token = await jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"7d"})
        return token;
    }
    catch (error) {
        console.error("jwt error:", error);
    }
}

const genTokenAdmin = async (email)=>{
    try{
        const token = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:"7d"})
        return token;
    }
    catch (error) {
        console.error("jwt error:", error);
    }
}



module.exports = {genToken, genTokenAdmin};