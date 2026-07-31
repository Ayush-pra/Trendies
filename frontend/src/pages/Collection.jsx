import React, { useContext, useEffect, useState, useMemo, useRef } from 'react'
import Title from '../components/Title';
import { shopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import { RxCross2 } from 'react-icons/rx';
import axios from 'axios';
import Loading from '../components/Loading';

// Constants
const PRODUCTS_PER_PAGE = 12;

// Price range definitions for the price filter
const PRICE_RANGES = [
  { key: '0-50', label: '₹0 - ₹50', min: 0, max: 50 },
  { key: '50-100', label: '₹50 - ₹100', min: 50, max: 100 },
  { key: '100-200', label: '₹100 - ₹200', min: 100, max: 200 },
  { key: '200+', label: '₹200+', min: 200, max: Infinity },
];

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const { search, showSearch } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);
  
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Custom sort dropdown state and ref
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortLabels = {
    relavent: "Sort By: Relevant",
    "low-high": "Sort By: Low to High",
    "high-low": "Sort By: High to Low",
  };

  // Toggle category filter (controlled checkboxes)
  const toggleCategory = (value) => {
    if (category.includes(value)) {
      setCategory(prev => prev.filter(item => item !== value));
    } else {
      setCategory(prev => [...prev, value]);
    }
  };

  // Toggle subcategory filter (controlled checkboxes)
  const toggleSubCategory = (value) => {
    if (subcategory.includes(value)) {
      setSubcategory(prev => prev.filter(item => item !== value));
    } else {
      setSubcategory(prev => [...prev, value]);
    }
  };

  // Toggle price range filter
  const togglePriceRange = (key) => {
    if (priceRanges.includes(key)) {
      setPriceRanges(prev => prev.filter(item => item !== key));
    } else {
      setPriceRanges(prev => [...prev, key]);
    }
  };

  // Remove a specific filter (used by filter chips)
  const removeFilter = (type, value) => {
    if (type === 'category') {
      setCategory(prev => prev.filter(item => item !== value));
    } else if (type === 'subcategory') {
      setSubcategory(prev => prev.filter(item => item !== value));
    } else if (type === 'price') {
      setPriceRanges(prev => prev.filter(item => item !== value));
    }
  };

  const fetchFilteredProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', PRODUCTS_PER_PAGE);
      if (showSearch && search) params.append('search', search);
      if (category.length > 0) params.append('category', category.join(','));
      if (subcategory.length > 0) params.append('subcategory', subcategory.join(','));
      if (priceRanges.length > 0) params.append('priceRanges', priceRanges.join(','));
      if (sortType) params.append('sort', sortType);

      const response = await axios.get(`${serverUrl}/api/product/catalog?${params.toString()}`);
      if (response.data.success) {
        setFilterProduct(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [category, subcategory, priceRanges, sortType, search, showSearch, currentPage]);

  // State Reset Rules: Reset page to 1 on filter, search, or sort type change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, subcategory, priceRanges, sortType]);

  // Compute count text showing range description
  const productCountText = useMemo(() => {
    if (totalCount === 0) {
      return "Showing 0 Products";
    }
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
    const end = Math.min(currentPage * PRODUCTS_PER_PAGE, totalCount);
    return `Showing ${start}–${end} of ${totalCount} Products`;
  }, [currentPage, totalCount]);

  // Check if any filters are active (for showing filter chips section)
  const hasActiveFilters = category.length > 0 || subcategory.length > 0 || priceRanges.length > 0;

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] flex flex-col md:flex-row pt-[70px]'>
      {/* Mobile Filter Toggle */}
      <div className='md:hidden p-4'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className='bg-slate-700 text-white px-4 py-2 rounded-md'
        >
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Sidebar Filters */}
      <div className={`${showFilter ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5 p-5 border-r border-gray-400 text-amber-600 md:sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto`}>
        <p className='text-2xl font-semibold mb-6'>Filters:</p>

        {/* Category Filter */}
        <div className='border-2 border-[#dedcdc] p-4 mt-4 rounded-md bg-zinc-900'>
          <p className='text-lg text-[#f8fafa] mb-2'>Categories:</p>
          <div className='flex flex-col gap-2'>
            {['Men', 'Women', 'Kids'].map((cat) => (
              <label key={cat} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  value={cat}
                  checked={category.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className='w-4 h-4'
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className='border-2 border-[#dedcdc] p-4 mt-4 rounded-md bg-zinc-900'>
          <p className='text-lg text-[#f8fafa] mb-2'>Sub-Categories:</p>
          <div className='flex flex-col gap-2'>
            {['TopWear', 'BottomWear', 'WinterWear'].map((sub) => (
              <label key={sub} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  value={sub}
                  checked={subcategory.includes(sub)}
                  onChange={() => toggleSubCategory(sub)}
                  className='w-4 h-4'
                />
                {sub}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className='border-2 border-[#dedcdc] p-4 mt-4 rounded-md bg-zinc-900'>
          <p className='text-lg text-[#f8fafa] mb-2'>Price Range:</p>
          <div className='flex flex-col gap-2'>
            {PRICE_RANGES.map((range) => (
              <label key={range.key} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  value={range.key}
                  checked={priceRanges.includes(range.key)}
                  onChange={() => togglePriceRange(range.key)}
                  className='w-4 h-4'
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Content */}
      <div className='flex-1 p-5'>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4'>
          <Title text1='ALL' text2='COLLECTION' />
          <div className='relative w-full lg:w-auto min-w-[200px]' ref={dropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className='bg-zinc-900 w-full h-12 px-3 text-white rounded-lg border-2 border-white hover:border-amber-400 transition-colors flex items-center justify-between gap-2 text-sm sm:text-base font-medium'
            >
              <span>{sortLabels[sortType] || "Sort By: Relevant"}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSortOpen && (
              <div className='absolute right-0 top-full mt-1.5 w-full bg-zinc-950 border-2 border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden py-1'>
                <button
                  onClick={() => {
                    setSortType("relavent");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm sm:text-base text-gray-200 hover:bg-amber-500 hover:text-black transition-colors ${sortType === 'relavent' ? 'bg-zinc-800 text-amber-400 font-semibold' : ''}`}
                >
                  Sort By: Relevant
                </button>
                <button
                  onClick={() => {
                    setSortType("low-high");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm sm:text-base text-gray-200 hover:bg-amber-500 hover:text-black transition-colors ${sortType === 'low-high' ? 'bg-zinc-800 text-amber-400 font-semibold' : ''}`}
                >
                  Sort By: Low to High
                </button>
                <button
                  onClick={() => {
                    setSortType("high-low");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm sm:text-base text-gray-200 hover:bg-amber-500 hover:text-black transition-colors ${sortType === 'high-low' ? 'bg-zinc-800 text-amber-400 font-semibold' : ''}`}
                >
                  Sort By: High to Low
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {category.map((cat) => (
              <span
                key={`cat-${cat}`}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-sm border border-amber-500/30 hover:bg-amber-500/25 transition-colors'
              >
                {cat}
                <RxCross2
                  className='w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors'
                  onClick={() => removeFilter('category', cat)}
                />
              </span>
            ))}
            {subcategory.map((sub) => (
              <span
                key={`sub-${sub}`}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-sm border border-amber-500/30 hover:bg-amber-500/25 transition-colors'
              >
                {sub}
                <RxCross2
                  className='w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors'
                  onClick={() => removeFilter('subcategory', sub)}
                />
              </span>
            ))}
            {priceRanges.map((rangeKey) => {
              const range = PRICE_RANGES.find(r => r.key === rangeKey);
              return (
                <span
                  key={`price-${rangeKey}`}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-sm border border-amber-500/30 hover:bg-amber-500/25 transition-colors'
                >
                  {range?.label}
                  <RxCross2
                    className='w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors'
                    onClick={() => removeFilter('price', rangeKey)}
                  />
                </span>
              );
            })}
          </div>
        )}

        {/* Product Count */}
        <p className='text-gray-400 text-sm mb-4'>
          {productCountText}
        </p>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
            {filterProduct.length > 0 ? (
              filterProduct.map((item, index) => (
                <Card
                  key={index}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-white py-12">
                <p className="text-xl">No products found matching your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

export default Collection;