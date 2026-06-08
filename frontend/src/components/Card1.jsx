import React, { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { wishlistDataContext } from '../context/WishlistContext';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Card1 = ({ name, image, price, id }) => {
  const { currency } = useContext(shopDataContext);
  const { isWishlisted, toggleWishlist } = useContext(wishlistDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

  const wishlisted = isWishlisted(id);

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
      onClick={() => navigate(`/productdetail/${id}`)}
      className="
        w-full max-w-[280px] mx-auto
        bg-[#111827] backdrop-blur-md
        rounded-xl border border-gray-800
        cursor-pointer overflow-hidden
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
      "
    >
      <div className="w-full h-40 sm:h-52 md:h-60 lg:h-[260px] overflow-hidden relative group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Wishlist heart icon — top right corner */}
        <button
          onClick={handleWishlistClick}
          className='absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-black/60 hover:scale-110 z-10'
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {wishlisted ? (
            <FaHeart className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500' />
          ) : (
            <FaRegHeart className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white' />
          )}
        </button>
      </div>
      <div className="p-2 sm:p-4">
        <h3 className="text-gray-200 text-sm sm:text-base font-semibold line-clamp-2">
          {name}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
          {currency}{price}
        </p>
      </div>
    </div>
  );
};

export default Card1;
