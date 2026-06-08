import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
  const [orderData, setorderData] = useState([]);
  const { currency } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { userData, authLoading } = useContext(userDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !userData) {
      navigate("/login");
    }
  }, [authLoading, userData]);

  const loadOrderedData = async () => {
    try {
      const result = await axios.post(
        serverUrl + "/api/order/userorders",
        {},
        { withCredentials: true }
      );

      if (result.data) {
        let allOrderItem = [];
        result.data.forEach((order) => {
          order.items.forEach((item) => {
            allOrderItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        setorderData(allOrderItem.reverse());
      }
    } catch (error) {
      console.error("loadOrderedData error:", error);
    }
  };

  useEffect(() => {
    loadOrderedData();
  }, []);

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-10 pb-32 bg-gradient-to-l from-[#040404] to-[#050c0e]">

      <div className="pt-20 sm:pt-24 text-center">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div className="mt-6 sm:mt-10 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-xl p-3 sm:p-4 md:p-6 flex flex-row gap-3 sm:gap-4 md:gap-6 items-start"
          >
       
            <img
              src={item.image1}
              alt={item.name}
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0"
            />

       
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-2 text-white">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">{item.name}</h3>

              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-amber-600">
                <span>{currency} {item.price}</span>
                <span>Qty: {item.quantity}</span>
                <span>Size: {item.size}</span>
              </div>

              <p className="text-xs sm:text-sm text-blue-400">
                Date:
                <span className="ml-1 sm:ml-2">
                  {new Date(item.date).toDateString()}
                </span>
              </p>

              <p className="text-xs sm:text-sm text-sky-400">
                Payment: {item.paymentMethod}
              </p>

              {/* Status & Track — inline on mobile */}
              <div className="flex items-center justify-between pt-1 sm:pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-white">{item.status}</span>
                </div>

                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 cursor-pointer text-white text-xs sm:text-sm rounded-md hover:bg-[#1b2a2a] transition"
                  onClick={loadOrderedData}
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}

   
        {orderData.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            You have no orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Order;
