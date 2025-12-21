const User = require("../model/userModel")

const getCurrentUser = async (req, res)=>{
    try{
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User Does not found"});
        }
        return res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"getCurrentUser error"})
    }
}

const getAdmin = async (req, res) => {
    try{
        const adminEmail = req.adminEmail;
        if(!adminEmail){
            return res.status(500).json({message:"getCurrentUadmin error"})
        }
        return res.status(200).json({
            email:adminEmail,
            role:"admin"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"getCurrentadmin catch error"})
    }
} 


module.exports = {getCurrentUser, getAdmin};