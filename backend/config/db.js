const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected")
    }
    catch{
        console.log("Database Not Connected")
    }
}

module.exports=connectDB;