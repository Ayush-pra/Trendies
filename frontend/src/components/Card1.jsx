import React, { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Card1 = ({ name, image, price, id }) => {
  const { currency } = useContext(shopDataContext);
  const navigate = useNavigate();

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
      <div className="w-full h-[260px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-gray-200 text-base font-semibold line-clamp-2">
          {name}
        </h3>
        <p className="text-gray-400 text-sm mt-2">
          {currency}{price}
        </p>
      </div>
    </div>
  );
};

export default Card1;
