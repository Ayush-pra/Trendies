import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../../context/AuthContext';
import axios from 'axios';
import { FiBox, FiUser, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { serverUrl } = useContext(authDataContext);

  const fetchOrders = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/order/list", {}, { withCredentials: true });
      setOrders(result.data.reverse());
    } catch (error) {
      console.error("fetchOrders error:", error);
    }
  };

  const statusHandle = async (e, orderId) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/status', { orderId, status: e.target.value }, { withCredentials: true });
      if (result.data) {
        await fetchOrders();
      }
    } catch (error) {
      console.error("statusHandle error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] text-white pb-20'>
      <Navbar />
      <Sidebar />
      <div className='pt-[100px] ml-16 sm:ml-20 md:ml-[18%] px-4 sm:px-6 md:px-10'>
        <h1 className='text-3xl md:text-4xl font-bold mb-8 text-white border-b-2 border-[#46d1f7] pb-2 inline-block'>Order Management</h1>
        
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
          {orders.map((item, index) => (
            <div key={index} className='bg-zinc-900/80 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex flex-col'>
              
              {/* Card Header (Order Info) */}
              <div className='bg-zinc-800/80 p-5 flex justify-between items-center border-b border-white/5'>
                <div className='flex items-center gap-3'>
                  <div className='bg-amber-500/20 p-3 rounded-xl'>
                    <FiBox className='text-amber-400 text-xl' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 uppercase tracking-wide'>Order ID</p>
                    <p className='text-lg font-bold text-white'>#{item._id.slice(-8)}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-gray-400 flex items-center justify-end gap-1 mb-1'>
                    <FiCalendar /> {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className='text-2xl font-bold text-green-400 flex items-center justify-end gap-1'>
                    <FiDollarSign />{item.amount}
                  </p>
                </div>
              </div>

              {/* Card Body (Customer & Items) */}
              <div className='p-6 flex-1 flex flex-col md:flex-row gap-6'>
                {/* Customer Details */}
                <div className='flex-1 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6'>
                  <h3 className='text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2'>
                    <FiUser className='text-amber-400' /> CUSTOMER DETAILS
                  </h3>
                  <p className='text-lg font-bold text-white mb-1'>
                    {item.address?.firstName} {item.address?.lastName}
                  </p>
                  <p className='text-sm text-gray-400 mb-4'>{item.address?.email} | {item.address?.phone}</p>
                  
                  <div className='flex items-start gap-2 mt-4'>
                    <FiMapPin className='text-blue-400 mt-1 flex-shrink-0' />
                    <p className='text-sm text-gray-300 leading-relaxed'>
                      {item.address?.street},<br/>
                      {item.address?.city}, {item.address?.state} {item.address?.zipcode}<br/>
                      {item.address?.country}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className='flex-1'>
                  <h3 className='text-sm font-semibold text-gray-400 mb-4'>ORDER ITEMS ({item.items.length})</h3>
                  <div className='max-h-[200px] overflow-y-auto pr-2 custom-scrollbar'>
                    {item.items.map((i, idx) => (
                      <div key={idx} className='flex justify-between items-center bg-white/5 p-3 rounded-lg mb-2'>
                        <div>
                          <p className='text-sm font-medium text-blue-300'>{i.name}</p>
                          <p className='text-xs text-gray-400'>Size: {i.size}</p>
                        </div>
                        <p className='text-sm font-bold text-white'>x{i.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer (Status & Payment) */}
              <div className='bg-zinc-800/50 p-5 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5'>
                <div className='flex gap-4'>
                  <div>
                    <p className='text-xs text-gray-400 mb-1'>Payment Method</p>
                    <p className='text-sm font-semibold text-white uppercase'>{item.paymentMethod}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 mb-1'>Payment Status</p>
                    {item.payment ? (
                      <span className='px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold'>Paid</span>
                    ) : (
                      <span className='px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold'>Pending</span>
                    )}
                  </div>
                </div>

                <div className='w-full sm:w-auto flex items-center gap-3'>
                  <p className='text-xs text-gray-400 uppercase'>Update Status:</p>
                  <select 
                    value={item.status} 
                    onChange={(e) => statusHandle(e, item._id)}
                    className='flex-1 sm:w-[160px] bg-zinc-900 border border-amber-400/50 text-amber-400 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer'
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className='col-span-full text-center py-20 text-gray-400 text-xl'>
              No orders found in the system.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
