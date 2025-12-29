import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../../context/AuthContext';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";

const List = () => {
  const [list, setlist] = useState([]);
  const { serverUrl } = useContext(authDataContext);

  const fetchList = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list", {
        withCredentials: true,
      });
      setlist(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removelist = async (id) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/product/remove/${id}`,
        {},
        { withCredentials: true }
      );
      if (result.data) fetchList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#100f0f] to-[#08161a] text-white">
      <Navbar />
      <Sidebar />
      <div
        className="
          pt-[90px]
          ml-16 sm:ml-20 md:ml-[18%]
          px-4 sm:px-6 md:px-10
          flex flex-col gap-8
        "
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-white">
          All Listed Products
        </h1>
        <div className="flex flex-col gap-4">
          {list?.length > 0 ? (
            list.map((item, index) => (
              <div
                key={index}
                className="
                  w-full
                  bg-zinc-800
                  rounded-xl
                  flex flex-col sm:flex-row
                  items-start sm:items-center
                  justify-between
                  gap-4
                  p-4 sm:px-6
                "
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={item.image1?.secure_url || item.image1}
                    className="w-20 h-20 object-cover rounded-lg"
                    alt={item.name}
                  />

                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-amber-400">
                      {item.name}
                    </h2>

                    <p className="text-sm text-green-500 font-medium">
                      ${item.price}
                    </p>

                    {item.sizes?.length > 0 && (
                      <p className="text-sm text-gray-200">
                        Sizes: {item.sizes.join(", ")}
                      </p>
                    )}

                    {item.bestseller && (
                      <span className="text-xs text-blue-400 font-semibold">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removelist(item._id)}
                  className="
                    self-end sm:self-center
                    p-3
                    rounded-full
                    hover:bg-red-600
                    transition
                    duration-200
                    shadow-md
                    cursor-pointer
                  "
                >
                  <RiDeleteBin6Line className="text-xl text-white" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-lg font-semibold text-white">
              No Products were Listed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
