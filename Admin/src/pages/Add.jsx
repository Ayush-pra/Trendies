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
  const [category, setcategory] = useState("Men");
  const [price, setprice] = useState("");
  const [SubCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setbestseller] = useState(false);
  const [sizes, setsizes] = useState([]);
  const [loading, setloading] = useState(false);

  const { serverUrl } = useContext(authDataContext);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", SubCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      await axios.post(serverUrl + "/api/product/addproduct", formData, { withCredentials: true });
      toast.success("Product Added Successfully");

      setname("");
      setdescription("");
      setimage1(null);
      setimage2(null);
      setimage3(null);
      setimage4(null);
      setprice("");
      setbestseller(false);
      setcategory("Men");
      setSubCategory("Topwear");
    } catch (error) {
      toast.error("Product Add Failed");
    }
    setloading(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] text-white">
      <Navbar />
      <Sidebar />

      <div className="pt-[80px] ml-16 sm:ml-20 md:ml-[18%] px-4 sm:px-6 md:px-10">
        <form
          onSubmit={handleAddProduct}
          className="max-w-4xl flex flex-col gap-8 py-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-[#46d1f7] pb-2">
            Add Products
          </h1>
          <div>
            <p className="text-xl font-semibold mb-2">Upload Images</p>
            <div className="flex flex-wrap gap-4">
              {[image1, image2, image3, image4].map((img, i) => (
                <label key={i} className="w-16 h-16 cursor-pointer">
                  <img
                    src={img ? URL.createObjectURL(img) : "/image/uploadimage.png"}
                    className="w-full h-full rounded-lg border-2"
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
            className="w-full max-w-[600px] h-12 bg-slate-700 rounded-xl px-4 text-lg"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
          <textarea
            className="w-full max-w-[600px] min-h-[120px] bg-slate-700 rounded-xl px-4 py-3 text-lg"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            required
          />
          <div className="flex flex-col md:flex-row gap-6">
            <select className="bg-slate-700 px-4 py-3 rounded-xl" onChange={(e) => setcategory(e.target.value)}>
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
            <select className="bg-slate-700 px-4 py-3 rounded-xl" onChange={(e) => setSubCategory(e.target.value)}>
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </div>
          <input
            type="number"
            className="w-full max-w-[600px] h-12 bg-slate-700 rounded-xl px-4 text-lg"
            placeholder="Price"
            value={price}
            onChange={(e) => setprice(e.target.value)}
            required
          />
          <div className="flex flex-wrap gap-3">
            {["S", "M", "L", "XL", "XXL"].map(size => (
              <div
                key={size}
                onClick={() =>
                  setsizes(prev =>
                    prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                  )
                }
                className={`px-5 py-2 rounded-lg cursor-pointer border 
                ${sizes.includes(size) ? "bg-green-600 text-black" : "bg-slate-600"}`}
              >
                {size}
              </div>
            ))}
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" onChange={() => setbestseller(!bestseller)} />
            Add to Bestseller
          </label>
          <button className="w-40 bg-blue-600 py-3 rounded-xl text-black font-semibold">
            {loading ? <Loading /> : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
