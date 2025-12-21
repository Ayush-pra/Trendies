import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { useContext } from 'react';
import { authDataContext } from '../../context/authContext';
import axios from 'axios';
import { useEffect } from 'react';
import { SiHackthebox } from "react-icons/si";

const Orders = () => {
  const [order, setorder] = useState([]);
  const { serverUrl } = useContext(authDataContext);

  const fetchOrders = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/order/list", {}, { withCredentials: true });
      setorder(result.data.reverse());
    }
    catch (error) {
      console.log(error);
    }
  }

  const statusHandle = async (e, orderId) => {
    try{
      const result = await axios.post(serverUrl + '/api/order/status', {orderId,status:e.target.value}, {withCredentials:true});
      if(result.data){
        await fetchOrders();
      }
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#131212] to-[#081619] text-white'>
      <Navbar />
      <div className='w-[100%] h-[100%] flex items-center lg:justify-start justify-center'>
        <Sidebar />
        <div className='lg:w-[85%] md:w-[70%] h-[100%] lg:ml-[310px] md:ml-[250px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]'>
          <div className='w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-white font-semibold'>All Orders List</div>
          {
            order.map((item, index) => (
              <div key={index} className='w-[90%] h-[40%] bg-zinc-800 rounded-xl flex lg:items-center items-start justify-between flex-col lg:flex-row p-[10px] md:px-[20px] gap-[20px]'>
                <SiHackthebox className='w-[60px] h-[60px] text-black p-[5px] rounded-lg bg-white' />
                <div className='flex items-start justify-center flex-col gap-[5px] text-[16px] text-[#56dbfc]'>
                  {item.items.map((i, index) => (
                    <p key={index}>
                      {i.name.toUpperCase()} X {i.quantity} <span>{i.size}</span>
                      {index !== item.items.length - 1 && ','}
                    </p>
                  ))}
                  <div className='text-[15px] text-white'>
                    
                    <p>{item.address.city + ", " + item.address.state + ", " + item.address.country + ", "  }</p>
                    <p>{item.address.phone}</p>
                  </div>
                </div>
                <div className='text-[15px] text-white'>
                  <p>Items : {item.items.length}</p>
                  <p>Method : {item.paymentMethod}</p>
                  <p>Payment : {item.payment?"Done":"Pending..."}</p>
                  <p>Date : {new Date(item.date).toLocaleDateString()}</p>  
                  <p className='text-[20px] text-green-700'>${item.amount}</p>
                </div>
                <select name="" value={item.status} id="" className='px-[5px] py-[10px] bg-zinc-900 rounded-lg border-[1px] border-amber-400' onChange={(e)=>statusHandle(e,item._id)}>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Orders;
