const multer = require("multer");

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "./public")
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage : storage,
    limits: {
        // Increase the limit for non-file fields (where a large Base64 string might land)
        // Set this high enough, e.g., 10MB, just in case other large data is sent.
        fieldSize: 10 * 1024 * 1024, // 10MB 
        
        // Increase the limit for file uploads (the images themselves)
        fileSize: 50 * 1024 * 1024 // 50MB (Should be plenty for large photos)
    }
});

module.exports = upload;