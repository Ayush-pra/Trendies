const express = require("express");
const upload = require("../model/multer");
const {addProduct, listproduct, removeproduct} = require("../controller/productController");
const adminAuth = require("../middleware/adminAuth");


const productRoute = express.Router();

productRoute.post("/addproduct", upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]), addProduct);

productRoute.get("/list", listproduct);
productRoute.post("/remove/:id", adminAuth, removeproduct);

module.exports = productRoute;