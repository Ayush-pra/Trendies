// const uploadOnCloudinary = require("../config/cloudinary.js");
// const Product = require("../model/productModel.js");

// const addProduct = async(req, res)=>{
//     try{
//         const {name, description, price, category, subCategory, sizes, bestseller} = req.body;
//         const image1 = await uploadOnCloudinary(req.files.image1[0].path);
//         const image2 = await uploadOnCloudinary(req.files.image2[0].path);
//         const image3 = await uploadOnCloudinary(req.files.image3[0].path);
//         const image4 = await uploadOnCloudinary(req.files.image4[0].path);

//         const productData = {
//             name, 
//             description, 
//             price : Number(price), 
//             category, 
//             subCategory, 
//             sizes : JSON.parse(sizes), 
//             bestseller : bestseller==="true" ? true : false,
//             date : Date.now(),
//             image1,
//             image2,
//             image3,
//             image4
//         }

//         const product = await Product.create(productData);

//         return res.status(201).json(product);
//     }
//     catch{
//         console.log("productData error");
//     }
// }

// const listproduct = async (req, res) => {
//     try{
//         const product = await Product.find({});
//         return res.status(200).json(product);
//     }
//     catch(error){
//         console.log(error)
//     }
// }

// const removeproduct = async (req, res) => {
//     try{
//         const {id} = req.params;
//         const product = await Product.findByIdAndDelete(id);
//         return res.status(200).json(product);
//     }
//     catch(error){
//         console.log(error)
//     }
// }

// module.exports = {addProduct, removeproduct, listproduct};

// const uploadOnCloudinary = require("../config/cloudinary.js");
// const Product = require("../model/productModel.js");

// /* =========================
//    ADD PRODUCT
// ========================= */
// const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       category,
//       subCategory,
//       sizes,
//       bestseller,
//     } = req.body;

//     // 🔒 Basic validation
//     if (!name || !price || !category || !sizes) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // 🔒 At least one image required
//     if (!req.files || !req.files.image1) {
//       return res.status(400).json({ message: "At least one image is required" });
//     }

//     // 🔁 Safe image uploader
//     const uploadImage = async (img) => {
//       if (!img || !img[0]) return null;
//       return await uploadOnCloudinary(img[0].path);
//     };

//     const image1 = await uploadImage(req.files.image1);
//     const image2 = await uploadImage(req.files.image2);
//     const image3 = await uploadImage(req.files.image3);
//     const image4 = await uploadImage(req.files.image4);

//     const productData = {
//       name,
//       description,
//       price: Number(price),
//       category,
//       subCategory,
//       sizes: JSON.parse(sizes),
//       bestseller: bestseller === "true",
//       date: Date.now(),
//       image1,
//       image2,
//       image3,
//       image4,
//     };

//     const product = await Product.create(productData);

//     return res.status(201).json(product);
//   } catch (error) {
//     console.log("productData error:", error);
//     return res.status(500).json({ message: "Product upload failed" });
//   }
// };

// /* =========================
//    LIST PRODUCTS
// ========================= */
// const listproduct = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     return res.status(200).json(products);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "List product failed" });
//   }
// };

// /* =========================
//    REMOVE PRODUCT
// ========================= */
// const removeproduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findByIdAndDelete(id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     return res.status(200).json({ message: "Product removed", product });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Remove product failed" });
//   }
// };

// module.exports = {
//   addProduct,
//   removeproduct,
//   listproduct,
// };


const Product = require("../model/productModel");
const uploadOnCloudinary = require("../config/cloudinary");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Validate required fields
    if (!name || !price || !category || !sizes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate images
    if (!req.files || !req.files.image1) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Upload images safely
    const uploadImage = async (img) => {
      if (!img || !img[0]) return null;
      return await uploadOnCloudinary(img[0].path);
    };

    const image1 = await uploadImage(req.files.image1);
    const image2 = await uploadImage(req.files.image2);
    const image3 = await uploadImage(req.files.image3);
    const image4 = await uploadImage(req.files.image4);

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: Boolean(bestseller),
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);
    return res.status(201).json(product);
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(500).json({ message: "Product upload failed" });
  }
};

const listproduct = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "List product failed" });
  }
};

const removeproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product removed", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Remove product failed" });
  }
};

module.exports = {
  addProduct,
  listproduct,
  removeproduct,
};
