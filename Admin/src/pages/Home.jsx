import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { useContext } from 'react';
import { authDataContext } from '../../context/AuthContext';
import axios from 'axios'
import { useEffect } from 'react';

const Home = () => {
  const [totalProduct, settotalProduct] = useState(0)
  const [totalOrders, settotalOrders] = useState(0)
  const { serverUrl } = useContext(authDataContext);

  const fetchCounts = async () => {
    try {
      const products = await axios.get(`${serverUrl}/api/product/list`, {}, { withCredentials: true })
      settotalProduct(products.data.length)

      const orders = await axios.post(`${serverUrl}/api/order/list`, {}, { withCredentials: true })
      settotalOrders(orders.data.length)
    }
    catch (error) {
      console.error("failed to fetch counts", error)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  // return (
  //   <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#131212] to-[#081619] text-white relative'>
  //     <Navbar />
  //     <Sidebar />
  //     <div className='w-[70vw] h-[100vh] absolute left-[25%] flex items-start justify-start flex-col gap-[40px] py-[100px]'>
  //       <h1 className='text-[35px] font-semibold text-white'>Total Sells </h1>
  //       <div className='flex items-center justify-start gap-[50px] flex-col md:flex-row'>
  //         <div className='text-amber-600 w-[400px] max-w-[90%] h-[200px] bg-zinc-900 flex items-center justify-center flex-col gap-[20px] rounded-lg shadow-sm shadow-black backdrop:blur-lg md:text-[25px] text-[30px] font-bold border-[2px] border-zinc-400'>
  //           Total No. of Products : <span className='px-[20px] py-[5px] bg-zinc-600 rounded-lg flex items-center justify-center border-[2px]'>{totalProduct}</span>
  //         </div>
  //         <div className='text-amber-600 w-[400px] max-w-[90%] h-[200px] bg-zinc-900 flex items-center justify-center flex-col gap-[20px] rounded-lg shadow-sm shadow-black backdrop:blur-lg md:text-[25px] text-[30px] font-bold border-[2px] border-zinc-400'>
  //           Total No. of Orders : <span className='px-[20px] py-[5px] bg-zinc-600 rounded-lg flex items-center justify-center border-[2px]'>{totalOrders}</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] text-white">
      <Navbar />
      <Sidebar />
    
      <div className="pt-[100px] ml-16 sm:ml-20 md:ml-[18%] px-4 sm:px-6 md:px-10">
        <h1 className="text-3xl font-semibold mb-10">Total Sells</h1>
    
        <div className="flex flex-col md:flex-row gap-8">
          {/* cards unchanged */}
        </div>
      </div>
    </div>
  );
}

export default Home;
