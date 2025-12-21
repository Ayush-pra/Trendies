import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title';
import { shopDataContext } from '../context/ShopContext';
import Card from '../components/Card';

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const { products, search, showSearch} = useContext(shopDataContext);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setSubcategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubcategory(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productCopy = products.slice();
    if(showSearch && search) {
        productCopy=productCopy.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
        productCopy = productCopy.filter(item => category.includes(item.category));
    }
    if (subcategory.length > 0) {
      productCopy = productCopy.filter(item => subcategory.includes(item.subCategory));
    }

    // Apply sorting
    if (sortType === "low-high") {
      productCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProduct(productCopy);
  };

  useEffect(() => {
    setFilterProduct(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subcategory, sortType, search, showSearch]);

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
            <label className='flex items-center gap-2'>
              <input type='checkbox' value='Men' onChange={toggleCategory} className='w-4 h-4' /> 
              Men
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' value='Women' onChange={toggleCategory} className='w-4 h-4' /> 
              Women
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' value='Kids' onChange={toggleCategory} className='w-4 h-4' /> 
              Kids
            </label>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className='border-2 border-[#dedcdc] p-4 mt-4 rounded-md bg-zinc-900'>
          <p className='text-lg text-[#f8fafa] mb-2'>Sub-Categories:</p>
          <div className='flex flex-col gap-2'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' value='TopWear' onChange={toggleSubCategory} className='w-4 h-4' /> 
              TopWear
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' value='BottomWear' onChange={toggleSubCategory} className='w-4 h-4' /> 
              BottomWear
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' value='WinterWear' onChange={toggleSubCategory} className='w-4 h-4' /> 
              WinterWear
            </label>
          </div>
        </div>
      </div>

      {/* Collection Content */}
      <div className='flex-1 p-5'>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4'>
          <Title text1='ALL' text2='COLLECTION' />
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className='bg-zinc-900 w-full lg:w-auto min-w-[200px] h-12 px-3 text-white rounded-lg border-2 border-white hover:border-amber-400 transition-colors'
          >
            <option value="relavent">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      </div>
    </div>
  )
}

export default Collection;