import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../../context/AuthContext';
import axios from 'axios';
import { FiBox, FiUser, FiMapPin, FiCalendar, FiChevronDown, FiChevronUp, FiFilter, FiPackage, FiPhone, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';

const statusConfig = {
  'Pending Payment': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  'Orderd Placed': { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  'Packing': { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400' },
  'Shipped': { bg: 'bg-indigo-500/15', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  'Out for Delivery': { bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-400' },
  'Delivered': { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-400' },
  'Payment Failed': { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  'Cancelled': { bg: 'bg-red-500/10', text: 'text-red-300', dot: 'bg-red-300' },
};

const getStatusStyle = (status) => statusConfig[status] || { bg: 'bg-white/10', text: 'text-gray-300', dot: 'bg-gray-400' };

const StatusBadge = ({ status }) => {
  const style = getStatusStyle(status);
  const displayLabel = status === 'Orderd Placed' ? 'Order Placed' : status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {displayLabel}
    </span>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { serverUrl } = useContext(authDataContext);

  const filterTags = [
    { label: 'All', color: 'bg-white/10 text-white', activeColor: 'bg-[#46d1f7]/20 text-[#46d1f7] border-[#46d1f7]' },
    { label: 'Orderd Placed', displayLabel: 'Order Placed', color: 'bg-blue-500/10 text-blue-400', activeColor: 'bg-blue-500/20 text-blue-400 border-blue-400' },
    { label: 'Packing', color: 'bg-purple-500/10 text-purple-400', activeColor: 'bg-purple-500/20 text-purple-400 border-purple-400' },
    { label: 'Shipped', color: 'bg-indigo-500/10 text-indigo-400', activeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-400' },
    { label: 'Out for Delivery', color: 'bg-orange-500/10 text-orange-400', activeColor: 'bg-orange-500/20 text-orange-400 border-orange-400' },
    { label: 'Delivered', color: 'bg-green-500/10 text-green-400', activeColor: 'bg-green-500/20 text-green-400 border-green-400' },
    { label: 'Pending Payment', color: 'bg-yellow-500/10 text-yellow-400', activeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-400' },
    { label: 'Payment Failed', color: 'bg-red-500/10 text-red-400', activeColor: 'bg-red-500/20 text-red-400 border-red-400' },
    { label: 'Cancelled', color: 'bg-red-500/10 text-red-300', activeColor: 'bg-red-500/20 text-red-300 border-red-300' },
  ];

  const getCount = (status) => {
    if (status === 'All') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter(o => o.status === activeFilter);

  const fetchOrders = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/order/list", {}, { withCredentials: true });
      setOrders(result.data.reverse());
    } catch (error) {
      console.error("fetchOrders error:", error);
    }
  };

  const statusHandle = async (e, orderId) => {
    e.stopPropagation();
    try {
      const result = await axios.post(serverUrl + '/api/order/status', { orderId, status: e.target.value }, { withCredentials: true });
      if (result.data) {
        await fetchOrders();
        toast.success(`Order status updated to ${e.target.value}`, { icon: "🚀" });
      }
    } catch (error) {
      console.error("statusHandle error:", error);
      toast.error("Failed to update order status");
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] text-white pb-20'>
      <Navbar />
      <Sidebar />
      <div className='pt-[100px] ml-16 sm:ml-20 md:ml-[18%] px-4 sm:px-6 md:px-10'>
        <h1 className='text-3xl md:text-4xl font-bold mb-6 text-white border-b-2 border-[#46d1f7] pb-2 inline-block'>Order Management</h1>

        {/* Filter Tags */}
        <div className='flex items-center gap-2 mb-6 flex-wrap'>
          <FiFilter className='text-gray-400 mr-1' />
          {filterTags.map((tag) => {
            const count = getCount(tag.label);
            const isActive = activeFilter === tag.label;
            return (
              <button
                key={tag.label}
                onClick={() => setActiveFilter(tag.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${isActive ? tag.activeColor + ' border' : tag.color + ' border-transparent hover:border-white/20'
                  }`}
              >
                {tag.displayLabel || tag.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table Header (Desktop) */}
        <div className='hidden lg:grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1.2fr_1.5fr_auto] gap-4 px-5 py-3 bg-zinc-800/60 rounded-t-xl border border-white/10 border-b-0 text-xs text-gray-400 uppercase tracking-wider font-semibold'>
          <span>Order ID</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Amount</span>
          <span>Payment</span>
          <span>Status</span>
          <span>Update Status</span>
          <span></span>
        </div>

        {/* Order Rows */}
        <div className='flex flex-col border border-white/10 rounded-xl lg:rounded-t-none overflow-hidden'>
          {filteredOrders.map((item) => {
            const isExpanded = expandedOrder === item._id;
            const isCancelled = item.status === 'Cancelled';
            const isPendingPayment = item.status === 'Pending Payment';
            const isPaymentFailed = item.status === 'Payment Failed';
            const isInactive = isCancelled || isPendingPayment || isPaymentFailed;

            // Build a short summary of items: "T-Shirt (M) x2, Jeans (L) x1"
            const itemSummary = item.items
              .map(i => `${i.name} (${i.size}) x${i.quantity}`)
              .join(', ');
            const customerName = `${item.address?.firstname || item.address?.firstName || ''} ${item.address?.lastname || item.address?.lastName || ''}`.trim();

            return (
              <div key={item._id} className={`border-b border-white/5 last:border-b-0 ${isInactive ? 'opacity-50' : ''}`}>

                {/* Compact Row — always visible */}
                <div
                  onClick={() => toggleExpand(item._id)}
                  className='cursor-pointer hover:bg-white/[0.03] transition-colors duration-150'
                >
                  {/* Desktop Row */}
                  <div className='hidden lg:grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1.2fr_1.5fr_auto] gap-4 items-center px-5 py-4'>
                    {/* Order ID */}
                    <div>
                      <p className='text-sm font-bold text-white'>#{item._id.slice(-6)}</p>
                      <p className='text-[10px] text-gray-500 mt-0.5'>{new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                    </div>

                    {/* Customer */}
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-white truncate'>{customerName || 'N/A'}</p>
                      <p className='text-[11px] text-gray-500 truncate'>{item.address?.city || ''}, {item.address?.state || ''}</p>
                    </div>

                    {/* Items (summary) */}
                    <div className='min-w-0'>
                      <p className='text-sm text-gray-300 truncate' title={itemSummary}>
                        {itemSummary}
                      </p>
                      <p className='text-[10px] text-gray-500 mt-0.5'>{item.items.length} item{item.items.length > 1 ? 's' : ''}</p>
                    </div>

                    {/* Amount */}
                    <p className='text-sm font-bold text-green-400'>₹{item.amount}</p>

                    {/* Payment */}
                    <div>
                      {item.payment ? (
                        <span className='px-2 py-0.5 bg-green-500/15 text-green-400 rounded-full text-[11px] font-semibold'>Paid</span>
                      ) : (
                        <span className='px-2 py-0.5 bg-red-500/15 text-red-400 rounded-full text-[11px] font-semibold'>Unpaid</span>
                      )}
                      <p className='text-[10px] text-gray-500 mt-1 uppercase'>{item.paymentMethod}</p>
                    </div>

                    {/* Status Badge */}
                    <StatusBadge status={item.status} />

                    {/* Update Status + Expand */}
                    <div className='flex items-center gap-2'>
                      <select
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => statusHandle(e, item._id)}
                        className='w-[140px] bg-zinc-900 border border-white/10 text-amber-400 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer'
                      >
                        <option value="Pending Payment">Pending Payment</option>
                        <option value="Orderd Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Payment Failed">Payment Failed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {isExpanded ? <FiChevronUp className='text-gray-400' /> : <FiChevronDown className='text-gray-400' />}
                    </div>
                  </div>

                  {/* Mobile Row */}
                  <div className='lg:hidden px-4 py-4'>
                    <div className='flex justify-between items-start mb-3'>
                      <div>
                        <p className='text-sm font-bold text-white'>#{item._id.slice(-6)}</p>
                        <p className='text-xs text-gray-500'>{new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <p className='text-lg font-bold text-green-400'>₹{item.amount}</p>
                        {isExpanded ? <FiChevronUp className='text-gray-400' /> : <FiChevronDown className='text-gray-400' />}
                      </div>
                    </div>

                    <div className='flex items-center justify-between gap-2 flex-wrap'>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-white truncate'>{customerName || 'N/A'}</p>
                        <p className='text-xs text-gray-400 truncate mt-0.5'>{itemSummary}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className='flex items-center gap-3 mt-3'>
                      {item.payment ? (
                        <span className='px-2 py-0.5 bg-green-500/15 text-green-400 rounded-full text-[11px] font-semibold'>Paid</span>
                      ) : (
                        <span className='px-2 py-0.5 bg-red-500/15 text-red-400 rounded-full text-[11px] font-semibold'>Unpaid</span>
                      )}
                      <span className='text-[10px] text-gray-500 uppercase'>{item.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details — only visible when clicked */}
                {isExpanded && (
                  <div className='bg-zinc-900/50 border-t border-white/5 px-5 py-5 animate-fadeIn'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                      {/* Column 1: Customer & Address */}
                      <div className='space-y-3'>
                        <h4 className='text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2'>
                          <FiUser className='text-amber-400' /> Customer & Shipping
                        </h4>
                        <div className='bg-white/[0.03] rounded-lg p-4 space-y-2'>
                          <p className='text-sm font-semibold text-white'>{customerName}</p>
                          <p className='text-xs text-gray-400 flex items-center gap-1.5'>
                            <FiMail className='text-blue-400 flex-shrink-0' />
                            {item.address?.email || 'N/A'}
                          </p>
                          <p className='text-xs text-gray-400 flex items-center gap-1.5'>
                            <FiPhone className='text-green-400 flex-shrink-0' />
                            {item.address?.phone || 'N/A'}
                          </p>
                          <div className='flex items-start gap-1.5 pt-2 border-t border-white/5'>
                            <FiMapPin className='text-cyan-400 mt-0.5 flex-shrink-0' />
                            <p className='text-xs text-gray-300 leading-relaxed'>
                              {item.address?.address || item.address?.street || ''},<br />
                              {item.address?.city}, {item.address?.state} {item.address?.pincode || item.address?.zipcode}<br />
                              {item.address?.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Items with product images */}
                      <div className='space-y-3'>
                        <h4 className='text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2'>
                          <FiPackage className='text-amber-400' /> Items ({item.items.length})
                        </h4>
                        <div className='space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar'>
                          {item.items.map((i, idx) => (
                            <div key={idx} className='flex items-center gap-3 bg-white/[0.03] rounded-lg p-3'>
                              {i.image && i.image[0] && (
                                <img src={i.image[0]} alt={i.name} className='w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0' />
                              )}
                              <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-white truncate'>{i.name}</p>
                                <p className='text-xs text-gray-400'>Size: <span className='text-white font-medium'>{i.size}</span> &nbsp;·&nbsp; Qty: <span className='text-white font-medium'>{i.quantity}</span></p>
                              </div>
                              <p className='text-sm font-bold text-green-400 flex-shrink-0'>₹{i.price * i.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 3: Order Actions */}
                      <div className='space-y-3'>
                        <h4 className='text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2'>
                          <FiBox className='text-amber-400' /> Order Actions
                        </h4>
                        <div className='bg-white/[0.03] rounded-lg p-4 space-y-4'>
                          <div>
                            <p className='text-xs text-gray-400 mb-1.5'>Update Status</p>
                            <select
                              value={item.status}
                              onChange={(e) => statusHandle(e, item._id)}
                              className='w-full bg-zinc-900 border border-amber-400/40 text-amber-400 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-400 cursor-pointer'
                            >
                              <option value="Pending Payment">Pending Payment</option>
                              <option value="Orderd Placed">Order Placed</option>
                              <option value="Packing">Packing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Payment Failed">Payment Failed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div className='grid grid-cols-2 gap-3 pt-2 border-t border-white/5'>
                            <div>
                              <p className='text-[10px] text-gray-500 uppercase'>Payment</p>
                              <p className='text-sm font-semibold text-white uppercase mt-0.5'>{item.paymentMethod}</p>
                            </div>
                            <div>
                              <p className='text-[10px] text-gray-500 uppercase'>Status</p>
                              {item.payment ? (
                                <p className='text-sm font-semibold text-green-400 mt-0.5'>Paid ✓</p>
                              ) : (
                                <p className='text-sm font-semibold text-red-400 mt-0.5'>Unpaid</p>
                              )}
                            </div>
                            <div>
                              <p className='text-[10px] text-gray-500 uppercase'>Order Date</p>
                              <p className='text-sm text-white mt-0.5'>{new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className='text-[10px] text-gray-500 uppercase'>Full ID</p>
                              <p className='text-[11px] text-gray-400 mt-0.5 font-mono break-all'>{item._id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className='text-center py-20 text-gray-400 text-xl'>
              {activeFilter === 'All' ? 'No orders found in the system.' : `No "${activeFilter === 'Orderd Placed' ? 'Order Placed' : activeFilter}" orders found.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
