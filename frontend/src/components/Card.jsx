import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { wishlistDataContext } from '../context/WishlistContext'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Card = ({ name, image, price, id }) => {
  const { currency } = useContext(shopDataContext);
  const { isWishlisted, toggleWishlist } = useContext(wishlistDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

  const wishlisted = isWishlisted(id);

  // Handle wishlist toggle — stops propagation so card click (navigate) doesn't fire
  const handleWishlistClick = async (e) => {
    e.stopPropagation();

    if (!userData) {
      toast.info("Please login to add items to your wishlist");
      navigate("/login");
      return;
    }

    await toggleWishlist(id);
  };

  return (
    <div
      className='w-full bg-[#ffffff0a] backdrop-blur-lg rounded-lg flex flex-col p-1.5 sm:p-3 cursor-pointer border border-[#80808049]'
      onClick={() => navigate(`/productdetail/${id}`)}
      style={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(245, 158, 11, 0.15), 0 4px 10px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product image with wishlist heart overlay */}
      <div className='w-full h-32 sm:h-48 md:h-56 lg:h-64 bg-white rounded-sm overflow-hidden relative group'>
        <img src={image} alt={name} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />

        {/* Wishlist heart icon — top right corner */}
        <button
          onClick={handleWishlistClick}
          className='absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-black/60 hover:scale-110 z-10'
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {wishlisted ? (
            <FaHeart className='w-3 h-3 sm:w-4 sm:h-4 text-red-500' />
          ) : (
            <FaRegHeart className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
          )}
        </button>
      </div>

      <div className='mt-1.5 sm:mt-3 text-[#c3f6fa] text-xs sm:text-[18px] truncate'>{name}</div>
      <div className='text-[#f3fafa] text-[10px] sm:text-[14px] mt-0.5 sm:mt-1'>{currency}{price}</div>
    </div>
  )
}

export default Card
