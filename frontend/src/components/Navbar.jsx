import React, { useContext, useState } from "react";
import { IoSearchSharp, IoLogOutOutline } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { HiShoppingCart, HiMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
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

localStorage.removeItem("user");
      navigate("/");

            
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
      <div
        className="
          fixed top-0 left-0 w-full h-[70px]
          bg-[#020617]/90 backdrop-blur-md
          border-b border-gray-800
          z-50 flex items-center justify-between
          px-4 md:px-10
        "
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/image/logo.png" alt="logo" className="w-8" />
          <h1 className="text-xl font-semibold text-gray-200 tracking-wide">
            Trendies
          </h1>
        </div>
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
          <HiMenuAlt3
            className="w-7 h-7 cursor-pointer text-gray-300 hover:text-amber-400 transition md:hidden"
            onClick={() => setMobileMenu(true)}
          />
        </div>
      </div>
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
