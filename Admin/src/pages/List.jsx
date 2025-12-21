import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../../context/authContext';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";

const List = () => {
  const [list, setlist] = useState([]);
  const { serverUrl } = useContext(authDataContext);

  const fetchList = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list");
      setlist(result.data);
      console.log(result.data)
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  const removelist = async (id) => {
    try {
      const result = await axios.post(`${serverUrl}/api/product/remove/${id}`, {}, { withCredentials: true });
      if (result.data) {
        fetchList();
      }
      else {
        console.log("Failed to remove Product");
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#100f0f] to-[#08161a] text-white'>
      <Navbar />
      <div className='w-[100%] h-[100%] flex items-center justify-start'>
        <Sidebar />
        <div className='w-[82%] h-[100%] lg:ml-[320px] md:ml-[230px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]'>
          <div className="text-[28px] md:text-[40px] mb-[20px] text-white font-semibold">
            All Listed Products
          </div>

          <div className="flex flex-col gap-[20px]">
            {list?.length > 0 ? (
              list.map((item, index) => (
                <div
                  key={index}
                  className="w-[90%] md:h-[120px] h-[90px] bg-zinc-800 rounded-xl flex items-center justify-between p-[10px] md:px-[30px] gap-[20px]"
                >
                  <div className="flex items-center gap-[20px]">
                    <img
                      src={item.image1?.secure_url || item.image1}
                      className="w-[80px] h-[80px] object-cover rounded-lg"
                      alt={item.name}
                    />
                    <div>
                      <h2 className="text-lg text-amber-400 font-semibold">{item.name}</h2>
                      <p className="text-sm text-green-600">${item.price}</p>
                      {item.sizes && item.sizes.length > 0 && (
                        <p className="text-sm text-gray-200">
                          Sizes: {item.sizes.join(", ")}
                        </p>
                      )}
                      {item.bestseller && (
                        <p className="text-sm text-gray-400">
                          Bestseller
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center" onClick={() => removelist(item._id)}>
                    <span className="p-2 rounded-full hover:bg-red-600 text-white text-xl transition duration-200 ease-in-out shadow-md cursor-pointer">
                      <RiDeleteBin6Line />
                    </span>
                  </div>
                </div>

              ))
            ) : (
              <div className="text-white text-lg font-semibold">
                No Products were Listed
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default List;
