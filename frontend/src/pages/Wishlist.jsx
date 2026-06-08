import React, { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { wishlistDataContext } from '../context/WishlistContext';
import { userDataContext } from '../context/UserContext';
import Title from '../components/Title';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { FaHeartBroken } from 'react-icons/fa';

const Wishlist = () => {
  const { products, currency } = useContext(shopDataContext);
  const { wishlistIds, wishlistLoading } = useContext(wishlistDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

  // If not logged in, redirect to login
  if (!userData) {
    return (
      <div className='w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] flex flex-col items-center justify-center pt-[70px]'>
        <p className='text-white text-xl mb-4'>Please login to view your wishlist</p>
        <button
          onClick={() => navigate('/login')}
          className='px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors'
        >
          Login
        </button>
      </div>
    );
  }

  // Cross-reference wishlist IDs with full product data
  const wishlistProducts = products.filter(product => wishlistIds.has(product._id));

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#131212] to-[#081619] pt-[70px] px-5 py-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <Title text1='MY' text2='WISHLIST' />
          <p className='text-gray-400 text-sm'>
            <span className='text-amber-400 font-semibold'>{wishlistProducts.length}</span> {wishlistProducts.length === 1 ? 'item' : 'items'} in wishlist
          </p>
        </div>

        {/* Wishlist Content */}
        {wishlistLoading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((item) => (
              <div key={item._id} className='relative'>
                <Card
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty wishlist state */
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <FaHeartBroken className='w-16 h-16 text-gray-600 mb-6' />
            <h3 className='text-white text-2xl font-semibold mb-2'>Your wishlist is empty</h3>
            <p className='text-gray-400 mb-8 max-w-md'>
              Browse our collection and tap the heart icon on products you love to save them here.
            </p>
            <button
              onClick={() => navigate('/collection')}
              className='px-8 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors'
            >
              Explore Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
