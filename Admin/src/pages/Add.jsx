import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const Add = () => {
  const [image1, setimage1] = useState(null);
  const [image2, setimage2] = useState(null);
  const [image3, setimage3] = useState(null);
  const [image4, setimage4] = useState(null);
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  
  // Now using Arrays for multi-select
  const [category, setcategory] = useState(["Men"]);
  const [SubCategory, setSubCategory] = useState(["TopWear"]);
  
  const [price, setprice] = useState("");
  const [bestseller, setbestseller] = useState(false);
  const [sizes, setsizes] = useState({});
  const [loading, setloading] = useState(false);

  const { serverUrl } = useContext(authDataContext);

  const toggleSize = (size) => {
    setsizes(prev => {
      const updated = { ...prev };
      if (size in updated) {
        delete updated[size];
      } else {
        updated[size] = 0; // default stock = 0
      }
      return updated;
    });
  };

  const updateSizeStock = (size, value) => {
    const stock = Math.max(0, parseInt(value) || 0);
    setsizes(prev => ({ ...prev, [size]: stock }));
  };

  const toggleCategory = (cat) => {
    setcategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleSubCategory = (sub) => {
    setSubCategory(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (category.length === 0 || SubCategory.length === 0) {
      toast.error("Please select at least one category and sub-category");
      return;
    }
    if (Object.keys(sizes).length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    setloading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("bestseller", bestseller);
      
      // Stringify the arrays/objects to send via FormData
      formData.append("category", JSON.stringify(category));
      formData.append("subCategory", JSON.stringify(SubCategory));
      formData.append("sizes", JSON.stringify(sizes));
      
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      await axios.post(serverUrl + "/api/product/addproduct", formData, { withCredentials: true });
      toast.success("Product Added Successfully");

      // Reset form
      setname("");
      setdescription("");
      setimage1(null);
      setimage2(null);
      setimage3(null);
      setimage4(null);
      setprice("");
      setbestseller(false);
      setcategory(["Men"]);
      setSubCategory(["TopWear"]);
      setsizes({});
    } catch (error) {
      console.error(error);
      toast.error("Product Add Failed");
    }
    setloading(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] text-white pb-20">
      <Navbar />
      <Sidebar />

      <div className="pt-[80px] ml-16 sm:ml-20 md:ml-[18%] px-4 sm:px-6 md:px-10">
        <form
          onSubmit={handleAddProduct}
          className="max-w-4xl flex flex-col gap-8 py-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-[#46d1f7] pb-2 inline-block self-start">
            Add New Product
          </h1>
          
          {/* Image Upload */}
          <div>
            <p className="text-xl font-semibold mb-3">Upload Images (Max 4)</p>
            <div className="flex flex-wrap gap-4">
              {[image1, image2, image3, image4].map((img, i) => (
                <label key={i} className="w-20 h-20 cursor-pointer relative group">
                  <img
                    src={img ? URL.createObjectURL(img) : "/image/uploadimage.png"}
                    className="w-full h-full object-cover rounded-xl border-2 border-white/20 group-hover:border-blue-400 transition-colors"
                  />
                  <input
                    type="file"
                    hidden
                    onChange={(e) => [setimage1, setimage2, setimage3, setimage4][i](e.target.files[0])}
                  />
                </label>
              ))}
            </div>
          </div>

          <input
            className="w-full h-12 bg-zinc-900/80 border border-white/10 rounded-xl px-4 text-lg focus:outline-none focus:border-blue-400"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
          <textarea
            className="w-full min-h-[120px] bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400 custom-scrollbar"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            required
          />
          
          <input
            type="number"
            className="w-full sm:w-1/2 h-12 bg-zinc-900/80 border border-white/10 rounded-xl px-4 text-lg focus:outline-none focus:border-blue-400"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setprice(e.target.value)}
            required
          />

          {/* Multi-Select Category & SubCategory */}
          <div className="flex flex-col md:flex-row gap-8 bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
            <div className="flex-1">
              <p className="text-lg font-semibold mb-3">Categories</p>
              <div className="flex flex-wrap gap-3">
                {['Men', 'Women', 'Kids'].map(cat => (
                  <div
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-lg cursor-pointer border transition-all duration-200 select-none
                    ${category.includes(cat) ? "bg-blue-600/20 border-blue-400 text-blue-300 font-semibold" : "bg-zinc-800 border-white/10 text-gray-400 hover:bg-zinc-700"}`}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-lg font-semibold mb-3">Sub-Categories</p>
              <div className="flex flex-wrap gap-3">
                {['TopWear', 'BottomWear', 'WinterWear'].map(sub => (
                  <div
                    key={sub}
                    onClick={() => toggleSubCategory(sub)}
                    className={`px-4 py-2 rounded-lg cursor-pointer border transition-all duration-200 select-none
                    ${SubCategory.includes(sub) ? "bg-purple-600/20 border-purple-400 text-purple-300 font-semibold" : "bg-zinc-800 border-white/10 text-gray-400 hover:bg-zinc-700"}`}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Size Selection with Per-Size Stock Input */}
          <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
            <p className="text-lg font-semibold mb-3">Select Sizes & Initial Stock</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {["S", "M", "L", "XL", "XXL"].map(s => (
                <div
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`px-5 py-2 rounded-lg cursor-pointer border transition-all duration-200 select-none
                  ${s in sizes ? "bg-green-600/20 border-green-400 text-green-300 font-semibold" : "bg-zinc-800 border-white/10 text-gray-400 hover:bg-zinc-700"}`}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Stock inputs for selected sizes */}
            {Object.keys(sizes).length > 0 && (
              <div className="flex flex-wrap gap-4 bg-zinc-900/80 rounded-xl p-5 border border-white/10 shadow-inner">
                {Object.entries(sizes).map(([s, stock]) => (
                  <div key={s} className="flex flex-col gap-1">
                    <span className="font-semibold text-green-400 ml-1 text-sm">Size {s}</span>
                    <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 border border-white/10">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">Qty:</span>
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => updateSizeStock(s, e.target.value)}
                        className="w-16 bg-zinc-700 border border-transparent rounded-md px-2 py-1 text-center text-white focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer bg-zinc-900/40 p-4 rounded-xl border border-white/5 w-max">
            <input 
              type="checkbox" 
              checked={bestseller} 
              onChange={() => setbestseller(!bestseller)} 
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
            <span className="font-semibold text-white">Mark as Bestseller</span>
          </label>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-64 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-white font-bold text-lg transition-colors shadow-lg shadow-blue-900/20 mt-4 flex justify-center items-center h-[60px]"
          >
            {loading ? <Loading /> : "PUBLISH PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
