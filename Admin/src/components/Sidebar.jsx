import React from "react";
import { IoBagAdd } from "react-icons/io5";
import { FaListCheck } from "react-icons/fa6";
import { MdBorderColor } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaSellsy } from "react-icons/fa6";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed top-0 left-0
        h-screen
        w-16 sm:w-20 md:w-[18%]
        border-r
        py-16
        bg-transparent
        z-40
      "
    >
      <div
        className="
          flex flex-col
          gap-4
          pt-10
          items-center
          md:items-start
          md:pl-[20%]
          text-sm
        "
      >
        <div
          onClick={() => navigate("/add")}
          className="
            w-full
            flex items-center justify-center md:justify-start
            gap-3
            border border-gray-200 border-r-0
            px-3 py-2
            cursor-pointer
            hover:bg-amber-800
          "
        >
          <IoBagAdd className="w-5 h-5" />
          <p className="hidden md:block">Add items</p>
        </div>

        <div
          onClick={() => navigate("/list")}
          className="
            w-full
            flex items-center justify-center md:justify-start
            gap-3
            border border-gray-200 border-r-0
            px-3 py-2
            cursor-pointer
            hover:bg-amber-800
          "
        >
          <FaListCheck className="w-5 h-5" />
          <p className="hidden md:block">List items</p>
        </div>

        <div
          onClick={() => navigate("/orders")}
          className="
            w-full
            flex items-center justify-center md:justify-start
            gap-3
            border border-gray-200 border-r-0
            px-3 py-2
            cursor-pointer
            hover:bg-amber-800
          "
        >
          <MdBorderColor className="w-5 h-5" />
          <p className="hidden md:block">View Orders</p>
        </div>
        <div
          onClick={() => navigate("/")}
          className="
            w-full
            flex items-center justify-center md:justify-start
            gap-3
            border border-gray-200 border-r-0
            px-3 py-2
            cursor-pointer
            hover:bg-amber-800
          "
        >
          <FaSellsy className="w-5 h-5" />
          <p className="hidden md:block">Total Sells</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
