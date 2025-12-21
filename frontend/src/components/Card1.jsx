// import React, { useContext } from 'react'
// import { shopDataContext } from '../context/ShopContext'
// import { useNavigate } from 'react-router-dom';

// const Card1 = ({name, image, price, id}) => {
//     const {currency} = useContext(shopDataContext);
//     const navigate = useNavigate();
//   return (
//     <div className='w-[300px] h-[400px] bg-[#ffffff0a] backdrop:blur-lg rounded-lg hover:scale-[102%] flex items-start justify-start flex-col p-[10px] cursor-pointer border-[1px] border-[#80808049]' onClick={()=>navigate(`/productdetail/${id}`)}>
//       <img src={image} alt="" className='w-[100%] h-[80%] rounded-sm object-cover'/>
//       <div className='text-[#c3f6fa] text-[18px] py-[10px]'>{name}</div>
//       <div className='text-[#f3fafa] text-[14px]'>{currency}{price}</div>
//     </div>
//   )
// }

// export default Card1


import React, { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Card1 = ({ name, image, price, id }) => {
  const { currency } = useContext(shopDataContext);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/productdetail/${id}`)}
      // bg-[#ffffff0a] border-white/10
      className="
        w-full max-w-[280px] mx-auto
        bg-[#111827] backdrop-blur-md
        rounded-xl border border-gray-800
        cursor-pointer overflow-hidden
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
      "
    >
      {/* Image */}
      <div className="w-full h-[260px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* text-[#c3f6fa] */}
        <h3 className="text-gray-200 text-base font-semibold line-clamp-2">
          {name}
        </h3>
{/* text-[#f3fafa] */}
        <p className="text-gray-400 text-sm mt-2">
          {currency}{price}
        </p>
      </div>
    </div>
  );
};

export default Card1;
