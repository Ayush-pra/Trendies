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

  const {serverUrl} = useContext(authDataContext);

  const handleAddProduct = async (e) => {
    setloading(true);
    e.preventDefault();
      try{
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("subCategory", SubCategory);
        formData.append("bestseller", bestseller);
        formData.append("sizes", JSON.stringify(sizes));
        if(image1) formData.append("image1", image1);
        if(image2) formData.append("image2", image2);
        if(image3) formData.append("image3", image3);
        if(image4) formData.append("image4", image4);
        
        const result = await axios.post(serverUrl + "/api/product/addproduct" , formData, {withCredentials:true});
        console.log(result.data);
        toast.success("Product Added Successfully");
        setloading(false);
        if(result.data){
          setname("");
          setdescription("");
          setimage1(null);
          setimage2(null);
          setimage3(null);
          setimage4(null);
          setprice("");
          setbestseller(false);
          setcategory("Men");
          setSubCategory("Top Wear");
        }
      }
      catch(error){
        console.log(`Add Product error ${(error)}`);
        setloading(false);
        toast("Product Added Failed");
      }
  }
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#131212] to-[#081619] text-white overflow-x-hidden relative'>
      <Navbar />
      <Sidebar />

      <div className='w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute right-0 bottom-[2%]'>
        <form action="" onSubmit={handleAddProduct} className='w-[100%] md:w-[90%] h-[100%] mt-[70px] flex flex-col gap-[30px] py-[60px] px-[30px] md:px-[60px]'>
          <div className="w-full mb-6">
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-wide 
                 text-white border-b-2 border-[#46d1f7] pb-2 inline-block">
              Add Products
            </h1>
          </div>
          <div className='w-[80%] h-[130px] flex items-start justify-center flex-col mt-[20px] gap-[10px]'>
            <p className='text-[20px] md:text-[25px] font-semibold'>Upload images</p>
            <div className='w-[1000%] h-[100%] flex items-center justify-start'>
              <label htmlFor="image1" className='w-[65px] h-[65px] cursor-pointer hover:border-b-sky-600'>
                <img src={image1 ? URL.createObjectURL(image1) : "/image/uploadimage.png"} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
                <input type="file" id="image1" hidden onChange={(e) => { setimage1(e.target.files[0]) }} required/>
              </label>
              <label htmlFor="image2" className='w-[65px] h-[65px] cursor-pointer hover:border-b-sky-600'>
                <img src={image2 ? URL.createObjectURL(image2) : "/image/uploadimage.png"} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
                <input type="file" id="image2" hidden onChange={(e) => { setimage2(e.target.files[0]) }} required/>
              </label>
              <label htmlFor="image3" className='w-[65px] h-[65px] cursor-pointer hover:border-b-sky-600'>
                <img src={image3 ? URL.createObjectURL(image3) : "/image/uploadimage.png"} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
                <input type="file" id="image3" hidden onChange={(e) => { setimage3(e.target.files[0]) }} required/>
              </label>
              <label htmlFor="image4" className='w-[65px] h-[65px] cursor-pointer hover:border-b-sky-600'>
                <img src={image4 ? URL.createObjectURL(image4) : "/image/uploadimage.png"} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
                <input type="file" id="image4" hidden onChange={(e) => { setimage4(e.target.files[0]) }} required/>
              </label>
            </div>
          </div>
          <div className="w-[80%] flex flex-col gap-[10px] mb-4">
            <label className="text-[20px] font-semibold">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name..."
              className="w-[600px] max-w-[98%] h-[50px] rounded-xl 
               bg-slate-700 px-[20px] text-[18px] text-white
               border-[2px] border-transparent focus:border-[#46d1f7] 
               transition-all duration-300 outline-none
               placeholder:text-[#ffffffa8]"
               onChange={(e)=>{setname(e.target.value)}}
               value={name}
               required
            />
          </div>
          <div className="w-[80%] flex flex-col gap-[10px]">
            <label className="text-[20px] font-semibold">Product Description</label>
            <textarea
              placeholder="Write a short description..."
              className="w-[600px] max-w-[98%] min-h-[120px] rounded-xl 
               bg-slate-700 px-[20px] py-[15px] text-[18px] text-white
               border-[2px] border-transparent focus:border-[#46d1f7] 
               transition-all duration-300 outline-none resize-y
               placeholder:text-[#ffffffa8]"
               onChange={(e)=>{setdescription(e.target.value)}}
               value={description}
               required
            />
          </div>
          <div className='w-[80%] flex flex-col md:flex-row gap-[30px] mb-[30px]'>
            {/* Category */}
            <div className='flex flex-col gap-[10px] w-full md:w-1/2'>
              <label className='text-[20px] font-semibold'>Product Category</label>
              <select
                className='bg-slate-700 w-full px-[15px] py-[12px] rounded-xl 
                 border-[2px] border-transparent focus:border-[#46d1f7] 
                 transition-all duration-300 outline-none text-[18px]'
                 onChange={(e)=>{setcategory(e.target.value)}}

              >
                <option value="">-- Select Category --</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            {/* SubCategory */}
            <div className='flex flex-col gap-[10px] w-full md:w-1/2 mb-[30px]'>
              <label className='text-[20px] font-semibold'>Product SubCategory</label>
              <select
                className='bg-slate-700 w-full px-[15px] py-[12px] rounded-xl 
                 border-[2px] border-transparent focus:border-[#46d1f7] 
                 transition-all duration-300 outline-none text-[18px]'
                 onChange={(e)=>{setSubCategory(e.target.value)}}
              >
                <option value="">-- Select SubCategory --</option>
                <option value="TopWear">Top Wear</option>
                <option value="BottomWear">Bottom Wear</option>
                <option value="WinterWear">Winter Wear</option>
              </select>
            </div>
          </div>
          <div className="w-[80%] flex flex-col gap-[10px] mb-4">
            <label className="text-[20px] font-semibold">Product Price</label>
            <input
              type="number"
              placeholder="$20"
              className="w-[600px] max-w-[98%] h-[50px] rounded-xl 
               bg-slate-700 px-[20px] text-[18px] text-white
               border-[2px] border-transparent focus:border-[#46d1f7] 
               transition-all duration-300 mb-5 outline-none
               placeholder:text-[#ffffffa8]"
               onChange={(e)=>{setprice(e.target.value)}}
               value={price}
               required
            />
          </div>
          <div className='w-[80%] h-[220px] md:h-[100px] flex items-start justify-center flex-col gap-[10px] py-[10px] md:py-[0px]'>
            <p className='text-[20px] font-semibold'>Product sizes</p>
            <div className='flex items-center justify-start gap-[15px] flex-wrap mb-5'>
              <div className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${sizes.includes("S")?"bg-green-600 text-black border-blue-500":""}`} onClick={()=>{setsizes(prev=>prev.includes("S") ? prev.filter(item=>item!=="S"):[...prev, "S"])}}>S</div>
              <div className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${sizes.includes("M")?"bg-green-600 text-black border-blue-500":""}`} onClick={()=>{setsizes(prev=>prev.includes("M") ? prev.filter(item=>item!=="M"):[...prev, "M"])}}>M</div>
              <div className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${sizes.includes("L")?"bg-green-600 text-black border-blue-500":""}`} onClick={()=>{setsizes(prev=>prev.includes("L") ? prev.filter(item=>item!=="L"):[...prev, "L"])}}>L</div>
              <div className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${sizes.includes("XL")?"bg-green-600 text-black border-blue-500":""}`} onClick={()=>{setsizes(prev=>prev.includes("XL") ? prev.filter(item=>item!=="XL"):[...prev, "XL"])}}>XL</div>
              <div className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${sizes.includes("XXL")?"bg-green-600 text-black border-blue-500":""}`} onClick={()=>{setsizes(prev=>prev.includes("XXL") ? prev.filter(item=>item!=="XXL"):[...prev, "XXL"])}}>XXL</div>
            </div>
          </div>
          <div className='w-[80%] flex items-center justify-start gap-[10px] mt-[20px] mb-5'>
            <input type="checkbox" id="checkbox" 
            className='w-[25px] h-[25px] cursor-pointer mb-5'
            onChange={()=>setbestseller(prev=>!prev)}/>
            <label htmlFor="checkbox" className='text-[18px] font-semibold mb-5'>Add to BestSeller</label>
          </div>
          <button className='w-[140px] px-[10px] py-[10px] rounded-xl bg-blue-600 flex items-center justify-center gap-[10px] text-black active:bg-slate-600 cursor-pointer hover:bg-blue-400 active:text-white active:border-[2px] border-white'>{loading? <Loading/>: "Add Product"}</button>
        </form>
      </div>
    </div>
  );
}

export default Add;
