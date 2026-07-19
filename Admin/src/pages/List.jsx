import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../../context/AuthContext';
import axios from 'axios';
import { RiDeleteBin6Line, RiEdit2Line, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { toast } from 'react-toastify';

const List = () => {
  const [list, setlist] = useState([]);
  const { serverUrl } = useContext(authDataContext);

  // State for inline stock editing
  const [editingId, setEditingId] = useState(null);
  const [editSizes, setEditSizes] = useState({});
  const [savingStock, setSavingStock] = useState(false);

  const fetchList = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list", {
        withCredentials: true,
      });
      setlist(result.data);
    } catch (error) {
      console.error("fetchList error:", error);
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
      if (result.data) {
        toast.success("Product removed");
        fetchList();
      }
    } catch (error) {
      console.error("removelist error:", error);
      toast.error("Failed to remove product");
    }
  };

  // Start editing stock
  const handleEditClick = (item) => {
    setEditingId(item._id);
    // Initialize with existing sizes or empty object
    setEditSizes(item.sizes && typeof item.sizes === 'object' && !Array.isArray(item.sizes) ? { ...item.sizes } : {});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditSizes({});
  };

  const handleStockChange = (size, value) => {
    const stock = Math.max(0, parseInt(value) || 0);
    setEditSizes(prev => ({ ...prev, [size]: stock }));
  };

  const saveStock = async (id) => {
    setSavingStock(true);
    try {
      await axios.post(
        `${serverUrl}/api/product/stock`,
        { productId: id, sizes: editSizes },
        { withCredentials: true }
      );
      toast.success("Stock updated successfully");
      setEditingId(null);
      fetchList();
    } catch (error) {
      console.error("saveStock error:", error);
      toast.error("Failed to update stock");
    }
    setSavingStock(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] text-white pb-20">
      <Navbar />
      <Sidebar />
      <div className="pt-[90px] ml-16 sm:ml-20 md:ml-[18%] px-4 sm:px-6 md:px-10 flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-[#46d1f7] pb-2 inline-block self-start">
          Inventory List
        </h1>
        
        <div className="flex flex-col gap-4">
          {list?.length > 0 ? (
            list.map((item, index) => (
              <div
                key={index}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-start sm:items-center gap-6 flex-1">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
                    <img
                      src={item.image1?.secure_url || item.image1}
                      className="w-full h-full object-cover"
                      alt={item.name}
                    />
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <h2 className="text-xl font-bold text-white">
                      {item.name}
                    </h2>

                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <p className="text-sm font-bold text-green-400">
                        ${item.price}
                      </p>
                      {item.category && (
                        <p className="text-sm text-gray-400">
                          Cat: <span className="text-gray-300">{Array.isArray(item.category) ? item.category.join(", ") : item.category}</span>
                        </p>
                      )}
                      {item.bestseller && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Stock Display or Edit Mode */}
                    <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5">
                      {editingId === item._id ? (
                        <div className="flex flex-col gap-3">
                          <p className="text-xs text-amber-400 font-semibold uppercase">Edit Stock Quantities</p>
                          <div className="flex flex-wrap gap-3">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                              <div key={s} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-1.5 border border-white/10">
                                <span className="text-blue-300 font-bold min-w-[20px]">{s}</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={editSizes[s] ?? ''}
                                  onChange={(e) => handleStockChange(s, e.target.value)}
                                  placeholder="0"
                                  className="w-14 bg-zinc-700 text-white text-center rounded border border-transparent focus:border-blue-400 focus:outline-none py-1"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => saveStock(item._id)}
                              disabled={savingStock}
                              className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <RiCheckLine /> {savingStock ? 'Saving...' : 'Save'}
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <RiCloseLine /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <p className="text-sm text-gray-300 flex flex-wrap gap-3">
                            {item.sizes && typeof item.sizes === 'object' && !Array.isArray(item.sizes) ? (
                              Object.entries(item.sizes).map(([s, stock]) => (
                                <span key={s} className="bg-zinc-800 px-2 py-1 rounded text-xs">
                                  <strong className="text-blue-300">{s}:</strong> <span className={stock <= 0 ? 'text-red-400 font-bold' : 'text-gray-300'}>{stock}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 italic">No stock data (Legacy)</span>
                            )}
                          </p>
                          <button 
                            onClick={() => handleEditClick(item)}
                            className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors bg-amber-400/10 px-3 py-1.5 rounded-lg"
                          >
                            <RiEdit2Line /> Edit Stock
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center h-full flex items-center">
                  <button
                    onClick={() => removelist(item._id)}
                    className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-200"
                    title="Delete Product"
                  >
                    <RiDeleteBin6Line className="text-xl" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-lg font-semibold text-gray-400 text-center py-20 bg-zinc-900/50 rounded-2xl border border-white/5">
              No Products were Listed in the Inventory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
