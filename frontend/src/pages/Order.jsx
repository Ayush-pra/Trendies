import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

const Order = () => {
  const [orderData, setorderData] = useState([]);
  const { currency } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);

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
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderedData();
  }, []);

  return (
    <div className="min-h-screen px-4 md:px-10 pb-32 bg-gradient-to-l from-[#040404] to-[#050c0e]">

      <div className="pt-24 text-center">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div className="mt-10 space-y-6 max-w-6xl mx-auto">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 relative"
          >
       
            <img
              src={item.image1}
              alt={item.name}
              className="w-full sm:w-32 sm:h-32 object-cover rounded-lg"
            />

       
            <div className="flex-1 space-y-2 text-white">
              <h3 className="text-lg font-semibold">{item.name}</h3>

              <div className="flex flex-wrap gap-3 text-sm text-amber-600">
                <span>{currency} {item.price}</span>
                <span>Qty: {item.quantity}</span>
                <span>Size: {item.size}</span>
              </div>

              <p className="text-sm text-blue-400">
                Date:
                <span className="ml-2">
                  {new Date(item.date).toDateString()}
                </span>
              </p>

              <p className="text-sm text-sky-400">
                Payment: {item.paymentMethod}
              </p>
            </div>

         
            <div className="flex sm:flex-col justify-between sm:items-end gap-3">
            
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-white">{item.status}</span>
              </div>

              <button
                className="px-4 py-2 bg-green-500 cursor-pointer text-white text-sm rounded-md hover:bg-[#1b2a2a] transition"
                onClick={loadOrderedData}
              >
                Track Order
              </button>
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
