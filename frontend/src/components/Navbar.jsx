// import React, { useContext, useState } from 'react'
// import { IoSearchSharp } from "react-icons/io5";
// import { FaCircleUser } from "react-icons/fa6";
// import { HiShoppingCart } from "react-icons/hi";
// import { userDataContext } from '../context/UserContext';
// import { RxCross2 } from "react-icons/rx";
// import { IoLogOutOutline } from "react-icons/io5";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { authDataContext } from '../context/authContext';
// import { shopDataContext } from '../context/ShopContext';
// import {Link} from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Loading from './Loading';

// const Navbar = () => {
//     const {userData, getCurrentUser} = useContext(userDataContext);
//     const {serverUrl} = useContext(authDataContext);
//     const {showSearch, setshowSearch, search, setsearch, getCartCount} = useContext(shopDataContext);
//     const [showProfile, setshowProfile] = useState(false);
//     const [loading, setloading] = useState(false);
//     const navigate = useNavigate();

//     const handleLogout = async (req, res)=>{
//         try{
//             setloading(true);
//             const result = await axios.get(serverUrl + "/api/auth/logout", {withCredentials:true});
//             console.log(result.data);
//             setloading(false);
//             await getCurrentUser();
//             toast.success("Logout Successfully");
//         }
//         catch{
//             console.log("logout error");
//             toast.error("Logout Error");
//         }
//     }

//   return(
//     <div className='w-[100vw] h-[70px] bg-[#ecfafaec] z-20 fixed top-0 flex items-center justify-between px-[30px] shadow-md shadow-black'>
//         <div className='w-[30%] flex items-center justify-start gap-[10px]'>
//             <img src="/image/logo.png" alt="" className='w-[30px]'/>
//             <h1 className='text-[25px] font-sans font-semibold'>Trendies</h1>
//         </div>
//         <div className='w-[40%]'>
//             <ul className='flex items-center justify-center gap-[40px] text-white'>
//                 <li className='text-[15px] cursor-pointer text-black font-semibold hover:text-blue-600' onClick={()=>navigate("/")}>Home</li>
//                 <li className='text-[15px] cursor-pointer text-black font-semibold hover:text-blue-600' onClick={()=>navigate("/collection")}>Collections</li>
//                 <li className='text-[15px] cursor-pointer text-black font-semibold hover:text-blue-600' onClick={()=>navigate("/about")}>About</li>
//                 <li className='text-[15px] cursor-pointer text-black font-semibold hover:text-blue-600' onClick={()=>navigate("/contact")}>Contact</li>
//             </ul>
//         </div>
//         <div className='w-[30%] flex items-center justify-end gap-[20px]'>
//             {!showSearch && <IoSearchSharp className='w-[30px] h-[30px] text-[#000000] cursor-pointer' onClick={()=>{setshowSearch(prev=>!prev);navigate("/collection")}}/>}
//             {showSearch && <RxCross2 className='w-[30px] h-[30px] text-[#000000] cursor-pointer' onClick={()=>{setshowSearch(prev=>!prev)}}/>}
//             {userData && <div className='w-[30px] h-[30px] bg-[#080808] text-white rounded-full flex items-center justify-center cursor-pointer' onClick={()=>{setshowProfile(prev=>!prev)}}>{userData?.name.slice(0,1)}</div>}
//             {!userData && <FaCircleUser className='w-[30px] h-[30px] text-[#000000] cursor-pointer' onClick={()=>{setshowProfile(prev=>!prev)}}/>}
//             <HiShoppingCart className='w-[30px] h-[30px] text-[#000000] cursor-pointer' onClick={()=>navigate("/cart")}/>
//             <p className='absolute w-[18px] h-[18px] items-center md:flex justify-center bg-black px-[5px] py-[2px]
//             text-white rounded-full text-[9px] top-[10px] right-[23px] hidden'>{getCartCount()}</p>
//         </div>
//         {showSearch && <div className='w-[100%] h-[80px] bg-[#d8f6f9dd] absolute top-[100%] left-0 right-0 flex items-center justify-center z-20'>
//             <input type="text" placeholder='Search Here...' className='w-[50%] h-[60%] bg-[#233533] rounded-[30px] px-[50px] placeholder:text-zinc-300 text-white text-[18px]' onChange={(e)=>{setsearch(e.target.value)}} value={search}/>
//         </div>}
//         {showProfile &&<div className='absolute w-[150px] h-[120px] bg-[#000000d7] top-[110%] right-[4%] border-[1px] border-[#aaa9a9] rounded-[10px] z-20'>
//             <ul className='w-[100%] h-[100%] flex items-start justify-around flex-col text-[17px] py-[5px] text-white'>
//                 {!userData && <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[3px] cursor-pointer' onClick={()=>{
//                     navigate("/login");
//                     setshowProfile(false);
//                     }}>Login</li>}
//                 {userData && <div className='flex justify-center items-end'>
//                 <li className='w-[100%] px-[15px] py-[3px] cursor-pointer'
//                 onClick={()=>{
//                     // navigate("/");
//                     handleLogout();
//                     setshowProfile(false);
//                 }}
//                 >{loading? <Loading/> : "Logout"}</li>
//                 <IoLogOutOutline className='text-[30px] w-[100%] px-[15px] py-[3px] cursor-pointer' onClick={()=>{
//                     // navigate("/");
//                     handleLogout();
//                     setshowProfile(false);
//                 }}/>
//                 </div>}
//                 {userData && <Link to='/order' className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[3px] cursor-pointer'> My Orders</Link>}
//                 <Link to='/about' className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[3px] cursor-pointer'>About</Link>
//             </ul>
//         </div>}
//     </div>
//   )
// }

// export default Navbar

// import React, { useContext, useState } from "react";
// import { IoSearchSharp, IoLogOutOutline } from "react-icons/io5";
// import { FaCircleUser } from "react-icons/fa6";
// import { HiShoppingCart, HiMenuAlt3 } from "react-icons/hi";
// import { RxCross2 } from "react-icons/rx";
// import { userDataContext } from "../context/UserContext";
// import { authDataContext } from "../context/authContext";
// import { shopDataContext } from "../context/ShopContext";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loading from "./Loading";

// const Navbar = () => {
//   const { userData, getCurrentUser } = useContext(userDataContext);
//   const { serverUrl } = useContext(authDataContext);
//   const { showSearch, setshowSearch, search, setsearch, getCartCount } =
//     useContext(shopDataContext);

//   const [showProfile, setshowProfile] = useState(false);
//   const [loading, setloading] = useState(false);
//   const [mobileMenu, setMobileMenu] = useState(false);

//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       setloading(true);
//       await axios.get(serverUrl + "/api/auth/logout", {
//         withCredentials: true,
//       });
//       await getCurrentUser();
//       toast.success("Logout Successfully");
//     } catch {
//       toast.error("Logout Error");
//     } finally {
//       setloading(false);
//     }
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <div className="fixed top-0 left-0 w-full h-[70px] bg-[#ecfafaec] z-50 flex items-center justify-between px-4 md:px-10 shadow-md">
        
//         {/* Logo */}
//         <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
//           <img src="/image/logo.png" alt="logo" className="w-8" />
//           <h1 className="text-xl font-semibold">Trendies</h1>
//         </div>

//         {/* Desktop Menu */}
//         <ul className="hidden md:flex items-center gap-10 font-semibold text-black">
//           <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Home</li>
//           <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/collection")}>Collections</li>
//           <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/about")}>About</li>
//           <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/contact")}>Contact</li>
//         </ul>

//         {/* Right Icons */}
//         <div className="flex items-center gap-4 relative">
//           {!showSearch ? (
//             <IoSearchSharp
//               className="w-6 h-6 cursor-pointer"
//               onClick={() => {
//                 setshowSearch(true);
//                 navigate("/collection");
//               }}
//             />
//           ) : (
//             <RxCross2
//               className="w-6 h-6 cursor-pointer"
//               onClick={() => setshowSearch(false)}
//             />
//           )}

//           {/* Profile */}
//           {userData ? (
//             <div
//               className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center cursor-pointer"
//               onClick={() => setshowProfile((p) => !p)}
//             >
//               {userData.name.slice(0, 1)}
//             </div>
//           ) : (
//             <FaCircleUser
//               className="w-7 h-7 cursor-pointer"
//               onClick={() => setshowProfile((p) => !p)}
//             />
//           )}

//           {/* Cart */}
//           <div className="relative">
//             <HiShoppingCart
//               className="w-7 h-7 cursor-pointer"
//               onClick={() => navigate("/cart")}
//             />
//             {getCartCount() > 0 && (
//               <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
//                 {getCartCount()}
//               </span>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <HiMenuAlt3
//             className="w-7 h-7 cursor-pointer md:hidden"
//             onClick={() => setMobileMenu(true)}
//           />
//         </div>
//       </div>

//       {/* Search Bar */}
//       {showSearch && (
//         <div className="fixed top-[70px] left-0 w-full bg-[#d8f6f9dd] py-4 z-40 flex justify-center">
//           <input
//             type="text"
//             placeholder="Search here..."
//             value={search}
//             onChange={(e) => setsearch(e.target.value)}
//             className="w-[90%] md:w-[50%] h-12 rounded-full px-6 bg-[#233533] text-white placeholder:text-gray-300"
//           />
//         </div>
//       )}

//       {/* Profile Dropdown */}
//       {showProfile && (
//         <div className="absolute top-[80px] right-4 w-40 bg-black text-white rounded-lg z-50">
//           <ul className="flex flex-col text-sm">
//             {!userData && (
//               <li
//                 className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </li>
//             )}

//             {userData && (
//               <li
//                 className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
//                 onClick={handleLogout}
//               >
//                 {loading ? <Loading /> : "Logout"}
//                 <IoLogOutOutline />
//               </li>
//             )}

//             {userData && (
//               <Link to="/order" className="px-4 py-2 hover:bg-gray-700">
//                 My Orders
//               </Link>
//             )}

//             <Link to="/about" className="px-4 py-2 hover:bg-gray-700">
//               About
//             </Link>
//           </ul>
//         </div>
//       )}

//       {/* Mobile Menu */}
//       {mobileMenu && (
//         <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
//           <div className="bg-white w-[70%] h-full p-6">
//             <RxCross2
//               className="w-6 h-6 mb-6 cursor-pointer"
//               onClick={() => setMobileMenu(false)}
//             />

//             <ul className="flex flex-col gap-6 font-semibold">
//               <li onClick={() => navigate("/")}>Home</li>
//               <li onClick={() => navigate("/collection")}>Collections</li>
//               <li onClick={() => navigate("/about")}>About</li>
//               <li onClick={() => navigate("/contact")}>Contact</li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;


import React, { useContext, useState } from "react";
import { IoSearchSharp, IoLogOutOutline } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { HiShoppingCart, HiMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/authContext";
import { shopDataContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";

const Navbar = () => {
  const { userData, getCurrentUser } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { showSearch, setshowSearch, search, setsearch, getCartCount } =
    useContext(shopDataContext);

  const [showProfile, setshowProfile] = useState(false);
  const [loading, setloading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setloading(true);
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      await getCurrentUser();
      toast.success("Logout Successfully");
    } catch {
      toast.error("Logout Error");
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div
        className="
          fixed top-0 left-0 w-full h-[70px]
          bg-[#020617]/90 backdrop-blur-md
          border-b border-gray-800
          z-50 flex items-center justify-between
          px-4 md:px-10
        "
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/image/logo.png" alt="logo" className="w-8" />
          <h1 className="text-xl font-semibold text-gray-200 tracking-wide">
            Trendies
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 font-medium text-gray-300">
          <li
            className="cursor-pointer hover:text-amber-400 transition-colors"
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className="cursor-pointer hover:text-amber-400 transition-colors"
            onClick={() => navigate("/collection")}
          >
            Collections
          </li>
          <li
            className="cursor-pointer hover:text-amber-400 transition-colors"
            onClick={() => navigate("/about")}
          >
            About
          </li>
          <li
            className="cursor-pointer hover:text-amber-400 transition-colors"
            onClick={() => navigate("/contact")}
          >
            Contact
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4 relative">
          {!showSearch ? (
            <IoSearchSharp
              className="w-6 h-6 cursor-pointer text-gray-300 hover:text-amber-400 transition"
              onClick={() => {
                setshowSearch(true);
                navigate("/collection");
              }}
            />
          ) : (
            <RxCross2
              className="w-6 h-6 cursor-pointer text-gray-300 hover:text-amber-400 transition"
              onClick={() => setshowSearch(false)}
            />
          )}

          {/* Profile */}
          {userData ? (
            <div
              className="
                w-8 h-8 rounded-full
                bg-amber-500 text-black font-semibold
                flex items-center justify-center
                cursor-pointer
              "
              onClick={() => setshowProfile((p) => !p)}
            >
              {userData.name.slice(0, 1)}
            </div>
          ) : (
            <FaCircleUser
              className="w-7 h-7 cursor-pointer text-gray-300 hover:text-amber-400 transition"
              onClick={() => setshowProfile((p) => !p)}
            />
          )}

          {/* Cart */}
          <div className="relative">
            <HiShoppingCart
              className="w-7 h-7 cursor-pointer text-gray-300 hover:text-amber-400 transition"
              onClick={() => navigate("/cart")}
            />
            {getCartCount() > 0 && (
              <span
                className="
                  absolute -top-2 -right-2
                  w-5 h-5 rounded-full
                  bg-amber-500 text-black text-[10px] font-bold
                  flex items-center justify-center
                "
              >
                {getCartCount()}
              </span>
            )}
          </div>

          {/* Mobile Menu Button */}
          <HiMenuAlt3
            className="w-7 h-7 cursor-pointer text-gray-300 hover:text-amber-400 transition md:hidden"
            onClick={() => setMobileMenu(true)}
          />
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div
          className="
            fixed top-[70px] left-0 w-full
            bg-[#020617]/95 backdrop-blur-md
            border-b border-gray-800
            py-4 z-40 flex justify-center
          "
        >
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            className="
              w-[90%] md:w-[50%] h-12 rounded-full px-6
              bg-[#111827] text-gray-200
              placeholder:text-gray-500
              border border-gray-700
              focus:border-amber-400 outline-none
            "
          />
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <div
          className="
            absolute top-[80px] right-4 w-44
            bg-[#111827] text-gray-200
            rounded-xl border border-gray-800
            shadow-xl z-50
          "
        >
          <ul className="flex flex-col text-sm">
            {!userData && (
              <li
                className="px-4 py-2 hover:bg-[#020617] hover:text-amber-400 transition cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </li>
            )}

            {userData && (
              <li
                className="px-4 py-2 hover:bg-[#020617] hover:text-amber-400 transition cursor-pointer flex items-center gap-2"
                onClick={handleLogout}
              >
                {loading ? <Loading /> : "Logout"}
                <IoLogOutOutline />
              </li>
            )}

            {userData && (
              <Link
                to="/order"
                className="px-4 py-2 hover:bg-[#020617] hover:text-amber-400 transition"
              >
                My Orders
              </Link>
            )}

            <Link
              to="/about"
              className="px-4 py-2 hover:bg-[#020617] hover:text-amber-400 transition"
            >
              About
            </Link>
          </ul>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden">
          <div className="bg-[#020617] w-[70%] h-full p-6 text-gray-200">
            <RxCross2
              className="w-6 h-6 mb-6 cursor-pointer hover:text-amber-400 transition"
              onClick={() => setMobileMenu(false)}
            />

            <ul className="flex flex-col gap-6 font-medium">
              <li
                className="hover:text-amber-400 transition cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </li>
              <li
                className="hover:text-amber-400 transition cursor-pointer"
                onClick={() => navigate("/collection")}
              >
                Collections
              </li>
              <li
                className="hover:text-amber-400 transition cursor-pointer"
                onClick={() => navigate("/about")}
              >
                About
              </li>
              <li
                className="hover:text-amber-400 transition cursor-pointer"
                onClick={() => navigate("/contact")}
              >
                Contact
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
