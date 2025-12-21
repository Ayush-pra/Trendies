// import React, { useContext, useEffect, useState } from 'react'
// import Title from '../components/Title'
// import { shopDataContext } from '../context/ShopContext';
// import { authDataContext } from '../context/authContext';
// import axios from 'axios';

// const Order = () => {
//   const [orderData, setorderData] = useState([]);
//   const {currency} = useContext(shopDataContext);
//   const {serverUrl} = useContext(authDataContext);

//   const loadOrderedData = async () => {
//       try{
//         const result = await axios.post(serverUrl + "/api/order/userorders" , {}, {withCredentials:true});
//         if(result.data){
//           let allOrderItem = [];
//           result.data.map((order)=>{
//             order.items.map((item)=>{
//               item['status']=order.status;
//               item['payment']=order.payment;
//               item['paymentMethod']=order.paymentMethod;
//               item['date']=order.date;
//               allOrderItem.push(item);
//             })
//           })
//           setorderData(allOrderItem.reverse());
//         }
//       }
//       catch(error){
//         console.log(error);
//       }
//   }

//   useEffect(()=>{
//     loadOrderedData()
//   }, [])
//   return (
//     <div className='w-[99vw] min-h-[100vh] p-[20px] pb-[150px] overflow-hidden bg-gradient-to-l from-[#141414] to-[#0c2025]'>
//       <div className='h-[8%] w-[100%] text-center mt-[80px]'>
//         <Title text1={'MY'} text2={'ORDERS'}/>
//       </div>
//       <div className='w-[100%] h-[92%] flex flex-wrap gap-[20px]'>
//         {
//           orderData.map((item, index)=>(
//             <div key={index} className='w-[100%] h-[10%] border-t border-b'>
//               <div className='w-[100%] h-[80%] flex items-start gap-6 bg-[#51808048] py-[10px] px-[20px] rounded-2xl relative'>
//                 <img src={item.image1} alt="" className='w-[130px] h-[130px] rounded-md'/>
//                 <div className='flex items-start justify-center flex-col gap-[5px]'>
//                   <p className='text-[20px] text-white'>{item.name}</p>
//                   <div className='flex items-center gap-[8px]'>
//                     <p className='text-[12px] text-sky-400'>{currency}</p>
//                     <p className='text-[12px] text-sky-400'>Quantity : {item.quantity}</p>
//                     <p className='text-[12px] text-sky-400'>size : {item.size}</p>
//                   </div>
//                   <div className='flex items-center'>
//                     <p className='text-[12px] text-sky-400'>Date : <span className='text-[11px] text-sky-400 pl-[10px]'>{new Date(item.date).toDateString()}</span></p>
//                   </div>
//                   <div className='flex items-center'>
//                     <p className='text-[12px] text-sky-400'>Payment Method : {item.paymentMethod}</p>
//                   </div>
//                   <div className='absolute right-[2%] top-[2%]'>
//                     <div className='flex items-center gap-[5px]'>
//                       <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
//                       <p className='text-[10px] text-white'>{item.status}</p>
//                     </div>
//                   </div>
//                   <div className='absolute right-[2%] top-[65%]'>
//                     <button className='px-[15px] py-[7px] rounded-md bg-[#101919] text-white text-[12px] cursor-pointer active:bg-slate-500' onClick={loadOrderedData}>Track Order</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         }
//       </div>
//     </div>
//   )
// }

// export default Order


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
      
      {/* Title */}
      <div className="pt-24 text-center">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {/* Orders List */}
      <div className="mt-10 space-y-6 max-w-6xl mx-auto">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="bg-zinc-900 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 relative"
          >
            {/* Product Image */}
            <img
              src={item.image1}
              alt={item.name}
              className="w-full sm:w-32 sm:h-32 object-cover rounded-lg"
            />

            {/* Order Info */}
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

            {/* Right Section */}
            <div className="flex sm:flex-col justify-between sm:items-end gap-3">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-white">{item.status}</span>
              </div>

              {/* Track Button */}
              <button
                className="px-4 py-2 bg-green-500 cursor-pointer text-white text-sm rounded-md hover:bg-[#1b2a2a] transition"
                onClick={loadOrderedData}
              >
                Track Order
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
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
