import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../../context/AuthContext';
import axios from 'axios';
import { FiDollarSign, FiShoppingBag, FiPackage, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const { serverUrl } = useContext(authDataContext);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${serverUrl}/api/product/list`, { withCredentials: true }),
        axios.post(`${serverUrl}/api/order/list`, {}, { withCredentials: true })
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;

      let revenue = 0;
      let pending = 0;

      orders.forEach(order => {
        if (order.payment || order.status === 'Delivered') {
          revenue += order.amount;
        }
        
        if (order.status !== 'Delivered') {
          pending += 1;
        }
      });

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        pendingOrders: pending
      });

      // Get 5 most recent orders
      setRecentOrders(orders.reverse().slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign size={24} />, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Total Orders", value: stats.totalOrders, icon: <FiShoppingBag size={24} />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Total Products", value: stats.totalProducts, icon: <FiPackage size={24} />, color: "text-amber-400", bg: "bg-amber-400/10" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: <FiTrendingUp size={24} />, color: "text-purple-400", bg: "bg-purple-400/10" }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] text-white">
      <Navbar />
      <Sidebar />
    
      <div className="pt-[100px] ml-16 sm:ml-20 md:ml-[18%] px-4 sm:px-6 md:px-10 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mb-8">Welcome back to the Trendies Admin Panel.</p>
    
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-zinc-900/80 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between hover:border-white/30 transition-all duration-300">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-white">{card.value}</h3>
              </div>
              <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-zinc-800/50 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm font-medium text-amber-400">#{order._id.slice(-6)}</td>
                      <td className="p-4">
                        <p className="text-sm text-white font-medium">{order.address?.firstName} {order.address?.lastName}</p>
                        <p className="text-xs text-gray-400">{order.address?.email}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-300">{order.items?.length || 0} items</td>
                      <td className="p-4 text-sm font-bold text-green-400">${order.amount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'Order Placed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.payment ? (
                          <span className="text-green-400 text-sm font-semibold flex items-center gap-1">Paid</span>
                        ) : (
                          <span className="text-amber-400 text-sm font-semibold flex items-center gap-1">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
