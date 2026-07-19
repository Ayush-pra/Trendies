import React, { useContext, useEffect, useState } from 'react'
import { authDataContext } from "../context/AuthContext";
import { useParams } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext';
import { FaStar, FaHeart, FaShare, FaTruck, FaUndo, FaShieldAlt, FaShoppingCart, FaCheck } from "react-icons/fa";
import RelatedProduct from '../components/RelatedProduct';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const ProductDetail = () => {
    const {productId} = useParams();
    const { serverUrl } = useContext(authDataContext);
    const {products, currency, AddtoCart} = useContext(shopDataContext);
    const [productData, setproductData] = useState(false);
    const [image, setimage] = useState('');
    const [image1, setimage1] = useState('');
    const [image2, setimage2] = useState('');
    const [image3, setimage3] = useState('');
    const [image4, setimage4] = useState('');
    const [size, setsize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setloading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { userData, authLoading } = useContext(userDataContext);
    const navigate = useNavigate();

    const fetchProductData = async () => {
    try {
        // Fetch only the specific product from the new Detail API
        const response = await axios.get(serverUrl + `/api/product/single/${productId}`);
        if (response.data.success) {
            const item = response.data.product;
            setproductData(item);
            setimage(item.image1);
            // Use optional chaining or defaults to prevent "undefined" crashes
            setimage1(item.image1 || "");
            setimage2(item.image2 || "");
            setimage3(item.image3 || "");
            setimage4(item.image4 || "");
        }
    } catch (error) {
        console.error("Error fetching product detail:", error);
    }
};
    
   useEffect(() => {
        if (!authLoading && !userData) {
            navigate("/login");
        }
    }, [authLoading, userData]);
    
    useEffect(()=>{
        fetchProductData()
    }, [productId, products]);

    // Helper to normalize sizes from either array (legacy) or object (new)
    const getNormalizedSizes = () => {
        if (!productData || !productData.sizes) return {};
        if (Array.isArray(productData.sizes)) {
            // Legacy format: ["S", "M", "L"] -> mock stock for each so they remain buyable
            return productData.sizes.reduce((acc, s) => ({ ...acc, [s]: 10 }), {});
        }
        return productData.sizes;
    };

    const normalizedSizes = getNormalizedSizes();

    // Helper: get stock count for the selected size
    const getStockForSize = (sizeName) => {
        return normalizedSizes[sizeName] ?? 0;
    };

    // Check if the entire product is out of stock (all sizes have 0)
    const isProductOutOfStock = () => {
        if (Object.keys(normalizedSizes).length === 0) return true;
        const sizeEntries = Object.values(normalizedSizes);
        return sizeEntries.every(stock => stock <= 0);
    };

    const selectedSizeStock = size ? getStockForSize(size) : null;
    const isSelectedSizeOutOfStock = size && selectedSizeStock <= 0;
    
    const handleAddToCart = async () => {
        if (!size) {
            toast.error("Please select a size before adding to cart.");
            return;
        }

        if (isSelectedSizeOutOfStock) {
            toast.error(`Size ${size} is out of stock.`);
            return;
        }

        setloading(true);
        try {
            await AddtoCart(productId, size, quantity); 
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
            toast.success("Product Added to the cart");
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to add to cart";
            toast.error(msg);
        }
        setloading(false);
    };
    
  return productData ? (
    <div className="min-h-screen pt-[60px] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product Images */}
          <div className="lg:w-1/2 flex flex-col md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 order-2 md:order-1">
              <div 
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${image === image1 ? 'border-blue-400' : 'border-gray-700'}`}
                onClick={() => setimage(image1)}
              >
                <img src={image1} className="w-full h-full object-cover" alt="Thumbnail 1" />
              </div>
              <div 
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${image === image2 ? 'border-blue-400' : 'border-gray-700'}`}
                onClick={() => setimage(image2)}
              >
                <img src={image2} className="w-full h-full object-cover" alt="Thumbnail 2" />
              </div>
              <div 
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${image === image3 ? 'border-blue-400' : 'border-gray-700'}`}
                onClick={() => setimage(image3)}
              >
                <img src={image3} className="w-full h-full object-cover" alt="Thumbnail 3" />
              </div>
              <div 
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${image === image4 ? 'border-blue-400' : 'border-gray-700'}`}
                onClick={() => setimage(image4)}
              >
                <img src={image4} className="w-full h-full object-cover" alt="Thumbnail 4" />
              </div>
            </div>
            
            {/* Main Image */}
            <div className="flex-1 order-1 md:order-2">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-800 p-6 border border-gray-700 shadow-lg">
                <img src={image} alt={productData.name} className="w-full h-full object-contain" />
              </div>
              
              {/* Action buttons */}
              
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{productData.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400" />
                ))}
              </div>
              <span className="text-gray-300">(120 reviews)</span>
              {/* Dynamic stock status */}
              {isProductOutOfStock() ? (
                <span className="ml-4 text-red-400 font-medium flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                  Out of Stock
                </span>
              ) : size ? (
                isSelectedSizeOutOfStock ? (
                  <span className="ml-4 text-red-400 font-medium flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                    Out of Stock
                  </span>
                ) : (
                  <span className="ml-4 text-green-400 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    In Stock ({selectedSizeStock} left)
                  </span>
                )
              ) : (
                <span className="ml-4 text-green-400 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  In Stock
                </span>
              )}
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-white">{currency} {productData.price}</p>
              <p className="text-sm text-gray-400">Inclusive of all taxes</p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">{productData.description} and Stylish, breathable cotton pent with a modern slim fit. Easy to wash, super comfortable, and designed for effortless style.</p>
            </div>
            
            {/* Size Selection — sizes is now an object { S: 5, M: 3, XL: 0 } */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(normalizedSizes).map(([sizeName, stock]) => {
                  const outOfStock = stock <= 0;
                  return (
                    <button
                      key={sizeName}
                      onClick={() => !outOfStock && setsize(sizeName)}
                      disabled={outOfStock}
                      className={`relative py-3 px-6 rounded-xl border transition-all duration-200 ${
                        outOfStock
                          ? 'border-red-800/50 text-gray-600 bg-gray-900/50 cursor-not-allowed line-through'
                          : sizeName === size 
                            ? 'border-blue-400 bg-blue-900/30 text-white font-medium cursor-pointer' 
                            : 'border-gray-700 text-gray-300 hover:border-gray-500 bg-gray-800/50 cursor-pointer'
                      }`}
                    >
                      {sizeName}
                      {outOfStock && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          0
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              
              
              <div className="flex gap-4">
                <button 
                className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                    isProductOutOfStock()
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : isSelectedSizeOutOfStock
                            ? 'bg-red-900/50 text-red-300 cursor-not-allowed border border-red-800/50'
                            : addedToCart 
                                ? 'bg-green-600 text-white cursor-pointer' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
                onClick={handleAddToCart}
                disabled={isProductOutOfStock() || isSelectedSizeOutOfStock}
            >
                  {isProductOutOfStock() ? (
                    <>Out of Stock</>
                  ) : isSelectedSizeOutOfStock ? (
                    <>Size {size} — Out of Stock</>
                  ) : addedToCart ? (
                    <>
                      <FaCheck className="text-lg" />
                      {loading? <Loading/>: "Added to Cart"}
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="text-lg" />
                      {loading? <Loading/>: "Add to Cart"}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Features */}
            <div className="border-t border-gray-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FaTruck className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Free Shipping</p>
                    <p className="text-sm text-gray-400">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FaUndo className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Easy Returns</p>
                    <p className="text-sm text-gray-400">30 days return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FaShieldAlt className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Secure Payment</p>
                    <p className="text-sm text-gray-400">Safe & encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Section */}
        <div className="mt-16 border-t border-gray-700 pt-10">
          <h2 className="text-2xl ml-[30px] font-bold text-white mb-6">Related Products :</h2>
                    <RelatedProduct category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id}/>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
}

export default ProductDetail

