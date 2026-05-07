const uploadOnCloudinary = require("../config/cloudinary.js");
const Product = require("../model/productModel.js");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    if (!name || !price || !category || !sizes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.files || !req.files.image1) {
      return res.status(400).json({ message: "At least one image is required" });
    }
    const uploadImage = async (imgArray) => {
      if (!imgArray || !imgArray[0]) return null;
      return await uploadOnCloudinary(imgArray[0].buffer);
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
      bestseller: bestseller === "true",
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);
    return res.status(201).json(product);
  } catch (error) {
    console.error("productData error:", error);
    return res.status(500).json({ message: "Product upload failed" });
  }
};

// const listproduct = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     return res.status(200).json(products);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "List product failed" });
//   }
// };

const listproduct = async (req, res) => {
  try {
    const products = await Product.find({})
      .select('name price image1 image2 image3 image4 category bestseller') 
      .lean(); 

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "List product failed" });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Fetch the full document without restrictions
    const product = await Product.findById(productId)
    .select('-__v -createdAt -updatedAt')
    .lean(); 
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeproduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product removed", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Remove product failed" });
  }
};

module.exports = {
  addProduct,
  removeproduct,
  listproduct,
  getSingleProduct
};


