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
      category: JSON.parse(category),
      subCategory: JSON.parse(subCategory),
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

const listproduct = async (req, res) => {
  try {
    const products = await Product.find({})
      .select('name price image1 image2 image3 image4 category subCategory sizes bestseller description date') 
      .lean(); 

    return res.status(200).json(products);
  } catch (error) {
    console.error("List product error:", error);
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
    console.error("Get single product error:", error);
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
    console.error("Remove product error:", error);
    return res.status(500).json({ message: "Remove product failed" });
  }
};

const updateStock = async (req, res) => {
  try {
    const { productId, sizes } = req.body;
    if (!productId || !sizes) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      { sizes },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Stock updated", product });
  } catch (error) {
    console.error("Update stock error:", error);
    return res.status(500).json({ message: "Update stock failed" });
  }
};

const catalogProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category,
      subcategory,
      priceRanges,
      sort,
      bestseller
    } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      const catArray = Array.isArray(category) ? category : category.split(",");
      query.category = { $in: catArray.map(c => new RegExp(`^${c}$`, "i")) };
    }

    if (subcategory) {
      const subArray = Array.isArray(subcategory) ? subcategory : subcategory.split(",");
      query.subCategory = { $in: subArray.map(s => new RegExp(`^${s}$`, "i")) };
    }

    if (bestseller) {
      query.bestseller = bestseller === "true";
    }

    if (priceRanges) {
      const ranges = Array.isArray(priceRanges) ? priceRanges : priceRanges.split(",");
      const orConditions = ranges.map(range => {
        const [min, max] = range.split("-");
        const maxVal = max === "+" ? Infinity : Number(max);
        return { price: { $gte: Number(min), $lt: maxVal === Infinity ? 999999999 : maxVal } };
      });
      if (orConditions.length > 0) {
        query.$or = orConditions;
      }
    }

    let sortOption = {};
    if (sort === "low-high") {
      sortOption.price = 1;
    } else if (sort === "high-low") {
      sortOption.price = -1;
    } else if (sort === "date-desc") {
      sortOption.date = -1;
    } else {
      sortOption._id = -1;
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .select('name price image1 image2 image3 image4 category subCategory sizes bestseller description date')
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
      totalCount
    });
  } catch (error) {
    console.error("Catalog product error:", error);
    return res.status(500).json({ success: false, message: "Catalog product failed" });
  }
};

const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Invalid IDs array" });
    }
    const products = await Product.find({ _id: { $in: ids } })
      .select('name price image1 sizes')
      .lean();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get products by IDs error:", error);
    return res.status(500).json({ success: false, message: "Get products by IDs failed" });
  }
};

module.exports = {
  addProduct,
  removeproduct,
  listproduct,
  getSingleProduct,
  updateStock,
  catalogProducts,
  getProductsByIds
};


