// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");

// const uploadOnCloudinary = async (filePath) => {
//      cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET 
//     });
//     try{
//         if(!filePath){
//             return null;
//         }
//         const uploadResult = await cloudinary.uploader
//            .upload(filePath)
//         fs.unlinkSync(filePath)
//         return uploadResult.secure_url
//     }
//     catch{
//         fs.unlinkSync(filePath)
//         console.log("cloudinary error")
//     }
// }

// module.exports = uploadOnCloudinary;

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // delete local file after upload
    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

module.exports = uploadOnCloudinary;
